function createTenDigitMobile(mobile) {
  // Remove all non-digit characters and spaces
  mobile = String(mobile);
  const cleanedText = mobile.replace(/\D/g, "");

  // Get the last 10 digits
  const last10Digits = cleanedText.slice(-10);

  return last10Digits;
}

module.exports = { createTenDigitMobile };
