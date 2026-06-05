package cn.edu.zju.chen.controller;

import cn.edu.zju.chen.model.ApiResponse;
import cn.edu.zju.chen.model.Narration;
import cn.edu.zju.chen.model.Slide;
import cn.edu.zju.chen.service.DeepSeekService;
import cn.edu.zju.chen.service.EdgeTtsService;
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

    @Operation(summary = "生成 AI 讲解稿", description = "传入幻灯片列表，调用 DeepSeek 生成讲解稿并异步合成语音")
    @PostMapping("/{id}/narrate")
    public ApiResponse<Narration> narrate(
            @Parameter(description = "任务 ID") @PathVariable String id,
            @RequestBody List<Slide> slides) {
        log.info("生成讲解稿, taskId={}, 共{}页", id, slides.size());
        Narration narration = deepSeekService.generateNarration(slides);

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
    @GetMapping(value = "/{id}/audio", produces = "audio/mpeg")
    public ResponseEntity<Resource> getAudio(
            @Parameter(description = "任务 ID") @PathVariable String id) {
        Resource audioResource = edgeTtsService.getAudioResource(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("audio/mpeg"))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.inline()
                                .filename(id + ".mp3")
                                .build()
                                .toString())
                .body(audioResource);
    }
}
