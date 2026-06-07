package cn.edu.zju.chen.service;

import cn.edu.zju.chen.model.SlideImage;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Base64;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class ImageRecognitionService {

    private final RestClient restClient;
    private final String apiKey;
    private final String model;

    public ImageRecognitionService(
            @Value("${VISION_API_KEY:}") String apiKey,
            @Value("${VISION_API_URL:https://dashscope.aliyuncs.com/compatible-mode/v1}") String apiUrl,
            @Value("${VISION_MODEL:qwen3.6-flash}") String model
    ) {
        this.apiKey = apiKey;
        this.model = model;
        this.restClient = RestClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, "application/json")
                .build();
    }

    public void recognize(List<SlideImage> images) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("VISION_API_KEY 未配置，跳过图片识别");
            return;
        }
        if (images == null || images.isEmpty()) {
            return;
        }

        for (SlideImage image : images) {
            try {
                String description = callVisionAPI(image.getMimeType(), image.getBase64Data());
                image.setDescription(description);
                log.info("图片识别完成: {}", image.getImageId());
            } catch (Exception e) {
                log.error("图片识别失败: {}", image.getImageId(), e);
                image.setDescription("[图片识别失败]");
            }
        }
    }

    private String callVisionAPI(String mimeType, String base64Data) {
        String dataUrl = "data:" + mimeType + ";base64," + base64Data;

        Map<String, Object> requestBody = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of("role", "user", "content", List.of(
                                Map.of("type", "image_url", "image_url",
                                        Map.of("url", dataUrl)),
                                Map.of("type", "text", "text",
                                        "请用简洁的中文描述这张图片的内容。如果图片中包含数学公式，请详细写出公式的内容。如果是图表，请描述图表展示的数据和趋势。如果是普通示意图，请描述图中的元素和它们表达的意思。")
                        ))
                ),
                "max_tokens", 500
        );

        VisionResponse response = restClient.post()
                .uri("/chat/completions")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .body(requestBody)
                .retrieve()
                .body(VisionResponse.class);

        if (response == null || response.choices() == null || response.choices().isEmpty()) {
            return "[图片无内容]";
        }

        String content = response.choices().get(0).message().content();
        return content != null ? content.trim() : "[图片无内容]";
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record VisionResponse(List<Choice> choices) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record Choice(Message message) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record Message(String content) {
    }
}
