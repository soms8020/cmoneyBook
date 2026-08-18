export default async function handler(req, res) {
    try {
        const module = await import('../server/src/app.js');
        const app = module.default;
        return app(req, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Fatal Initialization Exception in Serverless",
            errorMessage: error.message,
            stack: error.stack
        });
    }
}
