package cn.edu.zju.chen;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

@SpringBootApplication
public class PptReaderApplication {

    public static void main(String[] args) {
        loadDotenv();
        SpringApplication.run(PptReaderApplication.class, args);
    }

    private static void loadDotenv() {
        try (InputStream is = new FileInputStream(".env")) {
            Properties props = new Properties();
            props.load(is);
            props.forEach((key, value) -> {
                String k = (String) key;
                // 不覆盖已有的系统属性
                if (System.getProperty(k) == null) {
                    System.setProperty(k, (String) value);
                }
            });
            System.out.println("已加载 .env 文件，共 " + props.size() + " 个配置项");
        } catch (IOException e) {
            System.out.println("未找到 .env 文件，跳过（可复制 .env.example 创建）");
        }
    }

}
