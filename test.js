import { TOTP } from "totp-generator"

// Keys provided must be base32 strings, ie. only containing characters matching (A-Z, 2-7, =).
const { otp, expires } = TOTP.generate("DNEMGCWDHFARJDRAT4PCMXJ6KZ7HPS5A")

console.log(otp) 