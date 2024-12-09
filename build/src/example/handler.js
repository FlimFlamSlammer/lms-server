import { withValidation } from "../validation";
import { getExampleQuerySchema } from "./validation";
import { exampleService } from "./service";
export var getExampleHandler = withValidation({
    paramsSchema: getExampleQuerySchema
}, function(req, res, next) {
    try {
        var id = req.query.id;
        var data = exampleService.list();
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        next === null || next === void 0 ? void 0 : next(error);
    }
});
