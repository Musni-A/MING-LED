// ... other imports
import axios from "axios"; // You'll need to install axios or use fetch

router.post("/sendotp", async (req, res) => {
  const { to, body } = req.body;
  const API_KEY = process.env.TEXTBEE_API_KEY;
  const DEVICE_ID = process.env.TEXTBEE_DEVICE_ID;

  try {
    const response = await axios.post(`https://api.textbee.dev/api/v1/gateway/devices/${DEVICE_ID}/send-sms`, {
      recipients: [to],
      message: body,
    }, {
      headers: {
        'x-api-key': API_KEY,
      },
    });
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP" });
  }
});