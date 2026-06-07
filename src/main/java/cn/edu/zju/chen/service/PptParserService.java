package cn.edu.zju.chen.service;

import cn.edu.zju.chen.model.Slide;
import cn.edu.zju.chen.model.SlideImage;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xslf.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Base64;
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
                slide.setImages(new ArrayList<>());

                String title = "";
                StringBuilder content = new StringBuilder();

                for (XSLFShape shape : xslfSlide.getShapes()) {
                    if (shape instanceof XSLFPictureShape picShape) {
                        // 提取图片
                        extractImage(picShape, i, slide.getImages().size(), slide);
                    } else if (shape instanceof XSLFTextShape textShape) {
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
                log.debug("幻灯片 {}: 文本段落={}, 图片={}", i,
                        content.toString().lines().count(), slide.getImages().size());
            }
        }

        log.info("解析完成，共 {} 页幻灯片", slides.size());
        return slides;
    }

    private void extractImage(XSLFPictureShape picShape, int slideIdx, int imgIdx, Slide slide) {
        try {
            XSLFPictureData pictureData = picShape.getPictureData();
            byte[] bytes = pictureData.getData();
            String base64 = Base64.getEncoder().encodeToString(bytes);
            String mimeType = pictureData.getContentType();

            SlideImage image = new SlideImage();
            image.setImageId("slide" + slideIdx + "_img" + imgIdx);
            image.setMimeType(mimeType);
            image.setBase64Data(base64);
            image.setDescription(""); // 待 AI 识别

            slide.getImages().add(image);
        } catch (Exception e) {
            log.warn("幻灯片 {} 图片 {} 提取失败: {}", slideIdx, imgIdx, e.getMessage());
        }
    }
}
