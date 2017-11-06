import { All, Boolean, MandatoryFields, Number, Object, Required, Size, String, Value } from "paradise";

export const FacebookTokenRule = (currentTimeInSeconds: number) => {
    return All([
        Required(),
        Object(),
        MandatoryFields({
            is_valid: [Required(), Value([true])],
            app_id: [Required(), String(), Value(["1092068880930122"])],
            expires_at: [Required(), Number(), Size({ min: currentTimeInSeconds })]
        })
    ]);
};
