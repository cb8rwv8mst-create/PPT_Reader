package cn.edu.zju.chen.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Data
@Schema(description = "讲解稿")
public class Narration {

    @Schema(description = "完整讲解稿文本", example = "大家好，今天我来介绍...")
    private String fullScript;

    @Schema(description = "每页的讲解片段", example = "[\"第一页讲解...\", \"第二页讲解...\"]")
    private List<String> slideScripts;
}
