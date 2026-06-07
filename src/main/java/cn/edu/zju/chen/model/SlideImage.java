package cn.edu.zju.chen.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "幻灯片中的图片")
public class SlideImage {

    @Schema(description = "图片 ID", example = "slide0_img0")
    private String imageId;

    @Schema(description = "MIME 类型", example = "image/png")
    private String mimeType;

    @Schema(description = "AI 生成的图片描述（识别后填充）")
    private String description;

    @JsonIgnore
    private String base64Data;
}
