package cn.edu.zju.chen.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "幻灯片")
public class Slide {

    @Schema(description = "页码（从 0 开始）", example = "0")
    private int index;

    @Schema(description = "幻灯片标题", example = "项目介绍")
    private String title;

    @Schema(description = "正文内容", example = "本项目旨在...")
    private String content;

    @Schema(description = "演讲者备注", example = "此处可补充背景信息")
    private String notes;

    @Schema(description = "幻灯片中的图片列表")
    private List<SlideImage> images;
}
