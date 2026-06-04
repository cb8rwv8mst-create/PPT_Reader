package cn.edu.zju.chen.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Schema(description = "PPT 任务")
public class PptTask {

    @Schema(description = "任务 ID", example = "a1b2c3d4")
    private String id;

    @Schema(description = "原始文件名", example = "presentation.pptx")
    private String filename;

    @Schema(description = "幻灯片列表")
    private List<Slide> slides;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;
}
