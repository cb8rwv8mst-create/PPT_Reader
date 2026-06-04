package cn.edu.zju.chen.service;

import cn.edu.zju.chen.dto.NarrateResponse;
import cn.edu.zju.chen.dto.SlideDto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class DeepSeekService {

    private final RestClient restClient;
    private final String apiKey;

    public DeepSeekService(
            @Value("${DEEPSEEK_API_KEY:}") String apiKey,
            @Value("${DEEPSEEK_BASE_URL:https://api.deepseek.com}") String baseUrl
    ) {
        this.apiKey = apiKey;
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, "application/json")
                .build();
    }

    public NarrateResponse generateNarration(List<SlideDto> slides) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("DEEPSEEK_API_KEY is not configured.");
        }

        String prompt = buildPrompt(slides);

        Map<String, Object> requestBody = Map.of(
                "model", "deepseek-chat",
                "messages", List.of(
                        Map.of(
                                "role", "system",
                                "content", "你是一个专业的中文演讲者，擅长根据 PPT 内容生成自然、清晰、有逻辑的中文讲解稿。"
                        ),
                        Map.of(
                                "role", "user",
                                "content", prompt
                        )
                ),
                "temperature", 0.7
        );

        DeepSeekResponse response = restClient.post()
                .uri("/chat/completions")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .body(requestBody)
                .retrieve()
                .body(DeepSeekResponse.class);

        String fullScript = extractContent(response);
        List<String> slideScripts = splitBySlide(fullScript, slides.size());

        return new NarrateResponse(fullScript, slideScripts);
    }

    private String buildPrompt(List<SlideDto> slides) {
        StringBuilder sb = new StringBuilder();

        sb.append("""
                请根据下面的 PPT 幻灯片内容，生成一份自然流畅的中文讲解稿。

                要求：
                1. 按页生成讲解内容。
                2. 每一页必须用 [SLIDE_0]、[SLIDE_1] 这样的标记开头。
                3. 语言适合课堂讲解，要自然、清楚、有逻辑。
                4. 不要编造与幻灯片无关的内容。
                5. 每页讲解控制在一小段。

                PPT 内容如下：
                """);

        for (int i = 0; i < slides.size(); i++) {
            SlideDto slide = slides.get(i);

            sb.append("\n[PAGE_").append(i).append("]\n");
            sb.append("标题：").append(nullToEmpty(slide.title())).append("\n");
            sb.append("正文：").append(nullToEmpty(slide.content())).append("\n");
            sb.append("备注：").append(nullToEmpty(slide.notes())).append("\n");
        }

        return sb.toString();
    }

    private String extractContent(DeepSeekResponse response) {
        if (response == null || response.choices() == null || response.choices().isEmpty()) {
            throw new IllegalStateException("DeepSeek response is empty.");
        }

        DeepSeekMessage message = response.choices().get(0).message();

        if (message == null || message.content() == null || message.content().isBlank()) {
            throw new IllegalStateException("DeepSeek response content is empty.");
        }

        return message.content();
    }

    private List<String> splitBySlide(String fullScript, int slideCount) {
        List<String> result = new ArrayList<>();

        for (int i = 0; i < slideCount; i++) {
            String currentMarker = "[SLIDE_" + i + "]";
            String nextMarker = "[SLIDE_" + (i + 1) + "]";

            int start = fullScript.indexOf(currentMarker);

            if (start == -1) {
                result.add("");
                continue;
            }

            start += currentMarker.length();

            int end = fullScript.indexOf(nextMarker, start);

            if (end == -1) {
                end = fullScript.length();
            }

            result.add(fullScript.substring(start, end).trim());
        }

        return result;
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record DeepSeekResponse(
            List<DeepSeekChoice> choices
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record DeepSeekChoice(
            DeepSeekMessage message
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record DeepSeekMessage(
            String role,
            String content
    ) {
    }
}