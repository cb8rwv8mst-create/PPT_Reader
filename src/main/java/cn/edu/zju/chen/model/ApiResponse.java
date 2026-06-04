package cn.edu.zju.chen.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "统一响应")
public class ApiResponse<T> {

    @Schema(description = "状态码", example = "200")
    private int code;

    @Schema(description = "提示信息", example = "ok")
    private String message;

    @Schema(description = "响应数据")
    private T data;

    private ApiResponse(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(200, "ok", data);
    }

    public static <T> ApiResponse<T> error(int code, String message) {
        return new ApiResponse<>(code, message, null);
    }
}
