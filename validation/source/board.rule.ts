import { All, MandatoryFields, Object, RecognisedFields, Required, String } from "paradise";

export const BoardRule = () => {
    return All([
        Required(),
        Object(),
        RecognisedFields(["name", "image"]),
        MandatoryFields({
            name: [Required(), String()],
            image: [Required(), String()]
        })
    ]);
};
