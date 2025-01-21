import otpGenerator from 'otp-generator';

export const generateOTP = () => {
    const otp = otpGenerator.generate(4, { digits: true, specialChars: false });
    return otp
}