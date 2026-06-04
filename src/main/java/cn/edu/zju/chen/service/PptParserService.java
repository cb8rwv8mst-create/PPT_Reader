package cn.edu.zju.chen.service;

import cn.edu.zju.chen.model.Slide;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFShape;
import org.apache.poi.xslf.usermodel.XSLFSlide;
import org.apache.poi.xslf.usermodel.XSLFTextShape;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class PptParserService {

    public List<Slide> parse(MultipartFile file) throws IOException {
        List<Slide> slides = new ArrayList<>();

        try (InputStream is = file.getInputStream();
             XMLSlideShow ppt = new XMLSlideShow(is)) {

            List<XSLFSlide> xslfSlides = ppt.getSlides();
            for (int i = 0; i < xslfSlides.size(); i++) {
                XSLFSlide xslfSlide = xslfSlides.get(i);
                Slide slide = new Slide();
                slide.setIndex(i);

                String title = "";
                StringBuilder content = new StringBuilder();

                for (XSLFShape shape : xslfSlide.getShapes()) {
                    if (shape instanceof XSLFTextShape textShape) {
                        String text = textShape.getText();
                        if (text == null || text.isBlank()) {
                            continue;
                        }
                        text = text.trim();
                        if (title.isEmpty()) {
                            title = text;
                        } else {
                            if (!content.isEmpty()) {
                                content.append("\n");
                            }
                            content.append(text);
                        }
                    }
                }

                slide.setTitle(title);
                slide.setContent(content.toString());

                // 提取备注
                try {
                    var notes = xslfSlide.getNotes();
                    if (notes != null) {
                        StringBuilder notesText = new StringBuilder();
                        for (XSLFShape shape : notes.getShapes()) {
                            if (shape instanceof XSLFTextShape textShape) {
                                String text = textShape.getText();
                                if (text != null && !text.isBlank()) {
                                    if (!notesText.isEmpty()) {
                                        notesText.append("\n");
                                    }
                                    notesText.append(text.trim());
                                }
                            }
                        }
                        slide.setNotes(notesText.toString());
                    } else {
                        slide.setNotes("");
                    }
                } catch (Exception e) {
                    slide.setNotes("");
                }

                slides.add(slide);
            }
        }

        log.info("解析完成，共 {} 页幻灯片", slides.size());
        return slides;
    }
}
