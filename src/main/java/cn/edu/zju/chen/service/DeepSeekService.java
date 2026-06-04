package cn.edu.zju.chen.service;

import cn.edu.zju.chen.dto.NarrateResponse;
import cn.edu.zju.chen.dto.SlideDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DeepSeekService {

    public NarrateResponse generateNarration(List<SlideDto> slides) {
        List<String> slideScripts = new ArrayList<>();

        for (SlideDto slide : slides) {
            String title = slide.title() == null || slide.title().isBlank()
                    ? "无标题"
                    : slide.title();

            String content = slide.content() == null || slide.content().isBlank()
                    ? "暂无正文内容"
                    : slide.content();

            int pageNumber = slide.index() == null ? slideScripts.size() + 1 : slide.index() + 1;

            String script = "第 " + pageNumber + " 页讲解："
                    + "这一页的标题是《" + title + "》。"
                    + "主要内容是：" + content + "。"
                    + "这里后续会接入 DeepSeek API，自动生成更自然、更完整的中文讲解稿。";

            slideScripts.add(script);
        }

        String fullScript = String.join("\n\n", slideScripts);

        return new NarrateResponse(fullScript, slideScripts);
    }
}