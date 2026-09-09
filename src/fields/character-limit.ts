type CharacterLimitedInputType = "text" | "textarea";

export const characterLimitAdmin = (
  maxLength: number,
  inputType: CharacterLimitedInputType = "text",
) => ({
  components: {
    Field: {
      path: "/components/admin/CharacterLimitedTextField#CharacterLimitedTextField",
      clientProps: {
        inputType,
        maxLength,
      },
    },
  },
});
