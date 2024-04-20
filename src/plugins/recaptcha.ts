import { useReCaptcha } from 'vue-recaptcha-v3';

const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();

export const getReCaptcha = async (action: string) => {
  await recaptchaLoaded();
  return await executeRecaptcha(action);
};

export default getReCaptcha;
