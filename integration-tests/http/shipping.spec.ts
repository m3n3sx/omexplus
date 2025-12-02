import { medusaIntegrationTestRunner } from "@medusajs/test-utils";

jest.setTimeout(30000);

medusaIntegrationTestRunner({
  testSuite: ({ api }) => {
    describe("Shipping System Integration Tests", () => {
      describe("GET /store/shipping/methods", () => {
        it("should return available shipping methods", async () => {
          const response = await api.get("/store/shipping/methods");

          expect(response.status).toBe(200);
          expect(response.data.methods).toBeDefined();
          expect(Array.isArray(response.data.methods)).toBe(true);
        });

        it("should include InPost methods", async () => {
          const response = await api.get("/store/shipping/methods");

          const inpostMethods = response.data.methods.filter(
            (m: any) => m.provider === "inpost"
          );

          expect(inpostMethods.length).toBeGreaterThan(0);
          expect(inpostMethods[0]).toMatchObject({
            provider: "inpost",
            price: expect.any(Number),
            delivery_days: expect.any(Number),
          });
        });
      });

      describe("POST /store/shipping/rates", () => {
        it("should calculate rates for valid address", async () => {
          const response = await api.post("/store/shipping/rates", {
            postal_code: "00-001",
            country: "PL",
            weight: 1000,
          });

          expect(response.status).toBe(200);
          expect(response.data.rates).toBeDefined();
          expect(Array.isArray(response.data.rates)).toBe(true);
        });

        it("should return error for missing required fields", async () => {
          const response = await api.post("/store/shipping/rates", {
            postal_code: "00-001",
          });

          expect(response.status).toBe(400);
          expect(response.data.error).toBeDefined();
        });

        it("should include weight surcharge for heavy packages", async () => {
          const lightResponse = await api.post("/store/shipping/rates", {
            postal_code: "00-001",
            country: "PL",
            weight: 1000, // 1kg
          });

          const heavyResponse = await api.post("/store/shipping/rates", {
            postal_code: "00-001",
            country: "PL",
            weight: 7000, // 7kg
          });

          expect(heavyResponse.data.rates[0].price).toBeGreaterThan(
            lightResponse.data.rates[0].price
          );
        });
      });

      describe("POST /admin/orders/:id/shipment", () => {
        let orderId: string;

        beforeEach(async () => {
          // Create test order
          const orderResponse = await api.post("/admin/orders", {
            email: "test@example.com",
            shipping_address: {
              first_name: "John",
              last_name: "Doe",
              address_1: "Test Street 1",
              city: "Warsaw",
              postal_code: "00-001",
              country_code: "PL",
              phone: "+48123456789",
            },
            items: [
              {
                variant_id: "test_variant",
                quantity: 1,
              },
            ],
          });

          orderId = orderResponse.data.order.id;
        });

        it("should create shipment for order", async () => {
          const response = await api.post(`/admin/orders/${orderId}/shipment`, {
            shipping_method_id: "inpost_courier",
            weight: 1000,
          });

          expect(response.status).toBe(200);
          expect(response.data.shipment).toMatchObject({
            shipment_id: expect.any(String),
            tracking_number: expect.any(String),
            provider: expect.any(String),
            status: "pending",
          });
        });

        it("should return error for missing shipping method", async () => {
          const response = await api.post(`/admin/orders/${orderId}/shipment`, {
            weight: 1000,
          });

          expect(response.status).toBe(400);
          expect(response.data.error).toBeDefined();
        });

        it("should return error for non-existent order", async () => {
          const response = await api.post("/admin/orders/fake_id/shipment", {
            shipping_method_id: "inpost_courier",
            weight: 1000,
          });

          expect(response.status).toBe(404);
        });
      });

      describe("GET /store/shipments/:id/tracking", () => {
        let shipmentId: string;

        beforeEach(async () => {
          // Create test shipment
          const orderResponse = await api.post("/admin/orders", {
            email: "test@example.com",
            shipping_address: {
              first_name: "John",
              last_name: "Doe",
              address_1: "Test Street 1",
              city: "Warsaw",
              postal_code: "00-001",
              country_code: "PL",
            },
          });

          const shipmentResponse = await api.post(
            `/admin/orders/${orderResponse.data.order.id}/shipment`,
            {
              shipping_method_id: "inpost_courier",
              weight: 1000,
            }
          );

          shipmentId = shipmentResponse.data.shipment.tracking_number;
        });

        it("should return tracking information", async () => {
          const response = await api.get(`/store/shipments/${shipmentId}/tracking`);

          expect(response.status).toBe(200);
          expect(response.data.tracking).toMatchObject({
            tracking_number: expect.any(String),
            status: expect.any(String),
            events: expect.any(Array),
          });
        });

        it("should return error for non-existent shipment", async () => {
          const response = await api.get("/store/shipments/fake_id/tracking");

          expect(response.status).toBe(404);
        });
      });

      describe("GET /admin/shipments/:id/label", () => {
        let shipmentId: string;

        beforeEach(async () => {
          // Create test shipment
          const orderResponse = await api.post("/admin/orders", {
            email: "test@example.com",
            shipping_address: {
              first_name: "John",
              last_name: "Doe",
              address_1: "Test Street 1",
              city: "Warsaw",
              postal_code: "00-001",
              country_code: "PL",
            },
          });

          const shipmentResponse = await api.post(
            `/admin/orders/${orderResponse.data.order.id}/shipment`,
            {
              shipping_method_id: "inpost_courier",
              weight: 1000,
            }
          );

          shipmentId = shipmentResponse.data.shipment.shipment_id;
        });

        it("should return label URL", async () => {
          const response = await api.get(`/admin/shipments/${shipmentId}/label`);

          expect(response.status).toBe(200);
          expect(response.data.label_url).toBeDefined();
          expect(typeof response.data.label_url).toBe("string");
        });
      });

      describe("Webhook Handlers", () => {
        describe("POST /webhooks/inpost", () => {
          it("should process InPost webhook", async () => {
            const response = await api.post("/webhooks/inpost", {
              tracking_number: "1234567890",
              status: "in_transit",
              event_type: "status_update",
              timestamp: new Date().toISOString(),
              location: "Warsaw",
            });

            expect(response.status).toBe(200);
            expect(response.data.success).toBe(true);
          });

          it("should return error for missing tracking number", async () => {
            const response = await api.post("/webhooks/inpost", {
              status: "in_transit",
            });

            expect(response.status).toBe(400);
          });
        });

        describe("POST /webhooks/dpd", () => {
          it("should process DPD webhook", async () => {
            const response = await api.post("/webhooks/dpd", {
              tracking_number: "1234567890",
              status: "delivered",
              timestamp: new Date().toISOString(),
            });

            expect(response.status).toBe(200);
            expect(response.data.success).toBe(true);
          });
        });

        describe("POST /webhooks/dhl", () => {
          it("should process DHL webhook", async () => {
            const response = await api.post("/webhooks/dhl", {
              tracking_number: "1234567890",
              status: "out_for_delivery",
              timestamp: new Date().toISOString(),
            });

            expect(response.status).toBe(200);
            expect(response.data.success).toBe(true);
          });
        });
      });

      describe("Provider Selection Logic", () => {
        it("should select InPost for Poland", async () => {
          const response = await api.post("/store/shipping/rates", {
            postal_code: "00-001",
            country: "PL",
            weight: 1000,
          });

          const inpostRates = response.data.rates.filter(
            (r: any) => r.provider === "inpost"
          );

          expect(inpostRates.length).toBeGreaterThan(0);
        });

        it("should select DPD for EU countries", async () => {
          const response = await api.post("/store/shipping/rates", {
            postal_code: "10115",
            country: "DE",
            weight: 1000,
          });

          const dpdRates = response.data.rates.filter(
            (r: any) => r.provider === "dpd"
          );

          expect(dpdRates.length).toBeGreaterThan(0);
        });

        it("should select DHL for global destinations", async () => {
          const response = await api.post("/store/shipping/rates", {
            postal_code: "10001",
            country: "US",
            weight: 1000,
          });

          const dhlRates = response.data.rates.filter(
            (r: any) => r.provider === "dhl"
          );

          expect(dhlRates.length).toBeGreaterThan(0);
        });
      });
    });
  },
});
