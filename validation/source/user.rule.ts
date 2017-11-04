import { All, Any, Email, MandatoryFields, Object, RecognisedFields, Required, Size, String, Value } from "paradise";

export const AlphaApiCredentialRule = () => {
    return All([
        Required(),
        Object(),
        RecognisedFields(["type", "email", "password"]),
        MandatoryFields({
            type: [Required(), Value(["alpha-api"])],
            email: [Required(), String(), Email()],
            password: [Required(), String(), Size({ min: 6, max: 32 })]
        })
    ]);
};

export const FacebookCredentialRule = () => {
    return All([
        Required(),
        Object(),
        RecognisedFields(["type", "userId", "token"]),
        MandatoryFields({
            type: [Required(), Value(["facebook"])],
            userId: [Required(), String()],
            token: [Required(), String()]
        })
    ]);
};

export const UserRule = () => {
    return All([
        Required(),
        Object(),
        RecognisedFields(["email", "credential"]),
        MandatoryFields({
            email: [Required(), String(), Email()],
            credential: [Any([AlphaApiCredentialRule(), FacebookCredentialRule()])]
        })
    ]);
};
