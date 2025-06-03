import axios from "axios";
import { logger } from "../../libs/logger.js";
import { sanitizeObject } from "../../libs/sanitize.js";
import { PAYPAL_API, PAYPAL_API_CLIENT, PAYPAL_API_SECRET } from "../../config.js";
import { API_VERSION, PORT } from "../../config.js";

const createOrder = async (req, res) => {
    try {

        // objecto a recibir desde el frontend (Angular)
        const order = {
            intent: "CAPTURE",
            purchase_units: [  // 🔧 Este campo debe ser purchase_units (no "amount")
                {
                    reference_id: "ORDER-ATELIER-001",
                    amount: {
                        currency_code: "MXN",
                        value: "465.00",
                    },

                },
            ],
            application_context: {
                brand_name: "Atelier.com", landing_page: "LOGIN",
                user_action: "PAY_NOW",
                return_url: `http://localhost:${PORT}/api/${API_VERSION}/paypal/capture-order`,
                cancel_url: `http://localhost:${PORT}/api/${API_VERSION}/paypal/cancel-order`,
                //shipping_preference: "NO_SHIPPING" // si no estás usando dirección de envío
            },
        }

        const params = new URLSearchParams();
        params.append("grant_type", "client_credentials");


        const { data: { access_token } } = await axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token', params, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            auth: {
                username: PAYPAL_API_CLIENT,
                password: PAYPAL_API_SECRET
            },
        })

        const respuesta = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, order, {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        })

        console.log("Respuesta de PayPal:", respuesta.data);
        return res.status(200).json({ id: respuesta.data.id, links: respuesta.data.links });
    } catch (error) {
        logger.error("Error creating PayPal order", { error });
        res.status(500).send('Error del sevidor');
    }
};

const captureOrder = async (req, res) => {
    try {

        // el query extrae los dos parámetros de la URL: token y PayerID
        const { token, PayerID } = req.query;

        const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`, {}, {
            auth: {
                username: PAYPAL_API_CLIENT,
                password: PAYPAL_API_SECRET
            },
        }
        )

        console.log("Respuesta de PayPal:", response.data);

        return res.redirect('/payed.html')
    }
    catch (error) {
        console.error("Error capturing PayPal order:", error);
        logger.error("Error capturing PayPal order", { error });
        res.status(500).json({ error: "Failed to capture PayPal order" });
    }
}

const cancelOrder = async (req, res) => {
    try {

        //redirecionamos a la página de inicio
        res.redirect('/');

    } catch (error) {
        logger.error("Error cancelling PayPal order", { error });
        res.status(500).json({ error: "Failed to cancel PayPal order" });
    }
};

export const PaypalController = { createOrder, captureOrder, cancelOrder };