import { z } from "zod";

export const hexColor = z
  .string()
  .regex(
    /^[0-9a-fA-F]{6}$/,
    "Should be a 6-digit hexadecimal color code. e.g. 'ff0000' for red",
  );
