export const AcceptedTypes: MIMEType[] = [
  "image/png",
  "image/jpeg",
  "image/gif",
] as const;

export const PickerOpts: OpenFilePickerOptions = {
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
} as const;
