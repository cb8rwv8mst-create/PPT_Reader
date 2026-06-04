package cn.edu.zju.chen.controller;

import cn.edu.zju.chen.model.ApiResponse;
import cn.edu.zju.chen.model.PptTask;
import cn.edu.zju.chen.model.Slide;
import cn.edu.zju.chen.service.PptParserService;
import cn.edu.zju.chen.service.PptTaskStore;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/ppt")
@RequiredArgsConstructor
@Tag(name = "PPT 接口", description = "上传 PPTX 文件并获取幻灯片内容")
public class PptController {

    private final PptParserService pptParserService;
    private final PptTaskStore taskStore;

    @Operation(summary = "上传 PPTX 文件", description = "上传文件后自动解析幻灯片内容，返回任务 ID 和幻灯片列表")
    @PostMapping("/upload")
    public ApiResponse<PptTask> upload(
            @Parameter(description = "PPTX 文件") @RequestParam("file") MultipartFile file) throws IOException {
        log.info("收到文件上传: {}", file.getOriginalFilename());

        List<Slide> slides = pptParserService.parse(file);

        PptTask task = new PptTask();
        task.setId(UUID.randomUUID().toString().substring(0, 8));
        task.setFilename(file.getOriginalFilename());
        task.setSlides(slides);
        task.setCreatedAt(LocalDateTime.now());

        taskStore.save(task);

        log.info("上传完成, taskId={}, 共{}页", task.getId(), slides.size());
        return ApiResponse.ok(task);
    }

    @Operation(summary = "获取幻灯片列表", description = "根据任务 ID 获取已解析的幻灯片")
    @GetMapping("/{id}/slides")
    public ApiResponse<List<Slide>> getSlides(
            @Parameter(description = "任务 ID") @PathVariable String id) {
        PptTask task = taskStore.findById(id);
        return ApiResponse.ok(task.getSlides());
    }
}
