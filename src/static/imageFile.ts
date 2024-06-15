export const ACCEPTED_TYPES: MIMEType[] = [
  "image/png",
  "image/jpeg",
  "image/gif",
];

export const PICKER_OPTS: OpenFilePickerOptions = {
  types: [
    {
      description: "Images",
      accept: {
        "image/*": [".png", ".gif", ".jpeg", ".jpg"],
      },
    },
  ],
  excludeAcceptAllOption: true,
  multiple: true,
};
