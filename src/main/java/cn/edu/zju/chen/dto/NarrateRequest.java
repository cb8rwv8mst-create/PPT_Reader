package cn.edu.zju.chen.dto;

import java.util.List;

public record NarrateRequest(
        List<SlideDto> slides
) {
}