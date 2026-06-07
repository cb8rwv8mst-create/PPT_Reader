package cn.edu.zju.chen.controller;

import cn.edu.zju.chen.model.ApiResponse;
import cn.edu.zju.chen.model.Narration;
import cn.edu.zju.chen.model.PptTask;
import cn.edu.zju.chen.model.Slide;
import cn.edu.zju.chen.service.DeepSeekService;
import cn.edu.zju.chen.service.EdgeTtsService;
import cn.edu.zju.chen.service.ImageRecognitionService;
import cn.edu.zju.chen.service.PptTaskStore;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/ppt")
@RequiredArgsConstructor
@Tag(name = "AI 讲解接口", description = "生成讲解稿和语音")
public class NarrationController {

    private final DeepSeekService deepSeekService;
    private final EdgeTtsService edgeTtsService;
    private final ImageRecognitionService imageRecognitionService;
    private final PptTaskStore taskStore;

    @Operation(summary = "生成 AI 讲解稿", description = "传入幻灯片列表，调用 DeepSeek 生成讲解稿并异步合成语音。vision=false 跳过图片识别")
    @PostMapping("/{id}/narrate")
    public ApiResponse<Narration> narrate(
            @Parameter(description = "任务 ID") @PathVariable String id,
            @Parameter(description = "是否启用图片识别（默认 true）") @RequestParam(defaultValue = "true") boolean vision,
            @RequestBody List<Slide> slides) {
        log.info("生成讲解稿, taskId={}, vision={}, 共{}页", id, vision, slides.size());

        // 从 TaskStore 获取包含 base64 图片数据的完整 slides
        PptTask task = taskStore.findById(id);
        List<Slide> fullSlides = task.getSlides();

        // 先识别所有幻灯片中的图片
        if (vision) {
            for (Slide slide : fullSlides) {
                if (slide.getImages() != null && !slide.getImages().isEmpty()) {
                    imageRecognitionService.recognize(slide.getImages());
                }
            }
        }

        Narration narration = deepSeekService.generateNarration(fullSlides);

        // 异步合成语音
        new Thread(() -> {
            try {
                edgeTtsService.generateAudio(id, narration.getFullScript());
                log.info("语音合成完成, taskId={}", id);
            } catch (Exception e) {
                log.error("语音合成失败, taskId={}", id, e);
            }
        }).start();

        return ApiResponse.ok(narration);
    }

    @Operation(summary = "获取讲解语音", description = "获取已合成的 MP3 音频文件")
    @GetMapping("/{id}/audio")
    public ResponseEntity<?> getAudio(
            @Parameter(description = "任务 ID") @PathVariable String id) {
        try {
            Resource audioResource = edgeTtsService.getAudioResource(id);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType("audio/mpeg"))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            ContentDisposition.inline()
                                    .filename(id + ".mp3")
                                    .build()
                                    .toString())
                    .body(audioResource);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(404)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.error(404, e.getMessage()));
        }
    }
}
