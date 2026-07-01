let app: any;

export default async (req: any, res: any) => {
  try {
    if (!app) {
      const module = await import("../server");
      app = module.default;
    }
    return app(req, res);
  } catch (error: any) {
    console.error("Vercel Serverless Function Load Error:", error);
    res.status(500).json({
      success: false,
      error: "Vercel Serverless Function Load Error: " + error.message,
      stack: error.stack,
      cwd: process.cwd()
    });
  }
};
