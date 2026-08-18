/**
 * 성공적인 API 응답을 위한 공통 유틸리티
 */
export const sendSuccess = (res, data, statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        data,
    });
};
