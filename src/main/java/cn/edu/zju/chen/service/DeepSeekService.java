package cn.edu.zju.chen.service;

import cn.edu.zju.chen.model.Narration;
import cn.edu.zju.chen.model.Slide;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class DeepSeekService {

    private final RestClient restClient;
    private final String apiKey;

    public DeepSeekService(
            @Value("${DEEPSEEK_API_KEY:}") String apiKey,
            @Value("${DEEPSEEK_BASE_URL:https://api.deepseek.com}") String baseUrl
    ) {
        this.apiKey = apiKey;

        String safeBaseUrl = (baseUrl == null || baseUrl.isBlank())
                ? "https://api.deepseek.com"
                : baseUrl;

        this.restClient = RestClient.builder()
                .baseUrl(safeBaseUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, "application/json")
                .build();
    }

    public Narration generateNarration(List<Slide> slides) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("DEEPSEEK_API_KEY is not configured.");
        }

        String prompt = buildPrompt(slides);

        Map<String, Object> requestBody = Map.of(
                "model", "deepseek-v4-flash",
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
                .body(Objects.requireNonNull(requestBody))
                .retrieve()
                .body(DeepSeekResponse.class);

        String rawScript = extractContent(response);
        List<String> slideScripts = splitBySlide(rawScript, slides.size());

        // 拼接干净的讲解稿（去除标记符号），用于 TTS 播报和前端展示
        String cleanScript = String.join("\n\n", slideScripts);

        Narration narration = new Narration();
        narration.setFullScript(cleanScript);
        narration.setSlideScripts(slideScripts);
        return narration;
    }

    /**
     * 去除 [SLIDE_X] [PAGE_X] 等标记符号。
     */
    private String stripMarkers(String text) {
        return text.replaceAll("\\[SLIDE_\\d+\\]", "")
                   .replaceAll("\\[PAGE_\\d+\\]", "")
                   .replaceAll("\n{3,}", "\n\n")
                   .trim();
    }

    private String buildPrompt(List<Slide> slides) {
        StringBuilder sb = new StringBuilder();

        sb.append("请根据下面的 PPT 幻灯片内容，生成一份自然流畅的中文讲解稿。\n\n");
        sb.append("要求：\n");
        sb.append("1. 按页生成讲解内容。\n");
        sb.append("2. 每一页必须用 [SLIDE_0]、[SLIDE_1] 这样的标记开头。\n");
        sb.append("3. 语言适合课堂讲解，要自然、清楚、有逻辑。\n");
        sb.append("4. 不要编造与幻灯片无关的内容。\n");
        sb.append("5. 每页讲解控制在一小段。\n\n");
        sb.append("PPT 内容如下：\n");

        for (int i = 0; i < slides.size(); i++) {
            Slide slide = slides.get(i);

            sb.append("\n[PAGE_").append(i).append("]\n");
            sb.append("标题：").append(nullToEmpty(slide.getTitle())).append("\n");
            sb.append("正文：").append(nullToEmpty(slide.getContent())).append("\n");
            sb.append("备注：").append(nullToEmpty(slide.getNotes())).append("\n");
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

            String segment = fullScript.substring(start, end).trim();
            segment = stripMarkers(segment);
            result.add(segment);
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
