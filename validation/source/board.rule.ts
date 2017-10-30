import { All, MandatoryFields, Object, RecognisedFields, Required, Size, String } from "paradise";

export const BoardRule = () => {
    return All([
        Required(),
        Object(),
        RecognisedFields(["name", "image"]),
        MandatoryFields({
            name: [Required(), String(), Size({ above: 0 })],
            image: [Required(), String(), Size({ above: 0 })]
        })
    ]);
};
