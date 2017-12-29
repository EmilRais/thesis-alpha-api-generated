import { All, MandatoryFields, Number, Object, RecognisedFields, Required, Size, String, Value } from "paradise";

export const PostRule = () => {
    return All([
        Required(),
        Object(),
        MandatoryFields({
            title: [Required(), String(), Size({ min: 10, max: 50 })],
            description: [Required(), String(), Size({ min: 20, max: 500 })],
            kind: [Required(), Value(["LOST", "FOUND"])],
            date: [Required(), Number()],
            image: [Required(), String(), Size({ above: 0 })],
            location: [LocationRule()]
        })
    ]);
};

export const LocationRule = () => {
    return All([
        Required(),
        Object(),
        MandatoryFields({
            latitude: [Required(), Number()],
            longitude: [Required(), Number()],
            name: [Required(), String(), Size({ above: 0 })],
            city: [Required(), String(), Size({ above: 0 })],
            postalCode: [Required(), String(), Size({ above: 0 })]
        })
    ]);
};
