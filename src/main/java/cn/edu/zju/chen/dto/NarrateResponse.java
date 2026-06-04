package cn.edu.zju.chen.dto;

import java.util.List;

public record NarrateResponse(
        String fullScript,
        List<String> slideScripts
) {
}