import { ConsultingLeadModel } from "../../../src/models/consulting-lead.model";
import { InquiryModel } from "../../../src/models/inquiry.model";
import { TrainingCourseModel } from "../../../src/models/training-course.model";
import { TrainingEnrollmentModel } from "../../../src/models/training-enrollment.model";
import { createUser } from "../../helpers/factories";
import { api } from "../../helpers/requests";

async function loginToken(email: string) {
  const response = await api()
    .post("/api/v1/auth/login")
    .send({ email, password: "123456" })
    .expect(200);

  return response.body.data.token as string;
}

describe("mobile own-record endpoints", () => {
  describe("inquiries", () => {
    test("GET /inquiries/me returns only the caller's own inquiries", async () => {
      const owner = await createUser();
      const stranger = await createUser();

      await InquiryModel.create({
        userId: owner._id,
        title: "QA-TEST owner inquiry",
        message: "Own record",
        inquiryType: "GENERAL",
      });
      await InquiryModel.create({
        userId: stranger._id,
        title: "QA-TEST stranger inquiry",
        message: "Someone else",
        inquiryType: "GENERAL",
      });

      const token = await loginToken(owner.email);
      const response = await api()
        .get("/api/v1/inquiries/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe("QA-TEST owner inquiry");
    });

    test("mobile inquiry payloads exclude admin assignment", async () => {
      const owner = await createUser();
      const admin = await createUser({ role: "admin" });
      const inquiry = await InquiryModel.create({
        userId: owner._id,
        title: "QA-TEST projected inquiry",
        message: "Own record",
        inquiryType: "GENERAL",
        assignedTo: admin._id,
      });

      const token = await loginToken(owner.email);
      const response = await api()
        .get(`/api/v1/inquiries/${inquiry._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.data.assignedTo).toBeUndefined();
      expect(response.body.data.userId).toBeUndefined();
    });

    test("another user's inquiry is not readable", async () => {
      const owner = await createUser();
      const stranger = await createUser();
      const inquiry = await InquiryModel.create({
        userId: owner._id,
        title: "QA-TEST private inquiry",
        message: "Own record",
        inquiryType: "GENERAL",
      });

      const token = await loginToken(stranger.email);
      await api()
        .get(`/api/v1/inquiries/${inquiry._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });

    test("a new inquiry can be edited by its owner", async () => {
      const owner = await createUser();
      const inquiry = await InquiryModel.create({
        userId: owner._id,
        title: "QA-TEST editable inquiry",
        message: "Original message",
        inquiryType: "GENERAL",
      });

      const token = await loginToken(owner.email);
      const response = await api()
        .patch(`/api/v1/inquiries/${inquiry._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Updated message" })
        .expect(200);

      expect(response.body.data.message).toBe("Updated message");
    });

    test("a closed inquiry can no longer be edited", async () => {
      const owner = await createUser();
      const inquiry = await InquiryModel.create({
        userId: owner._id,
        title: "QA-TEST closed inquiry",
        message: "Original message",
        inquiryType: "GENERAL",
        status: "CLOSED",
      });

      const token = await loginToken(owner.email);
      await api()
        .patch(`/api/v1/inquiries/${inquiry._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Updated message" })
        .expect(409);
    });

    test("status cannot be forced through the mobile update route", async () => {
      const owner = await createUser();
      const inquiry = await InquiryModel.create({
        userId: owner._id,
        title: "QA-TEST strict inquiry",
        message: "Original message",
        inquiryType: "GENERAL",
      });

      const token = await loginToken(owner.email);
      await api()
        .patch(`/api/v1/inquiries/${inquiry._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ status: "CLOSED" })
        .expect(400);
    });

    test("cancelling an inquiry closes it", async () => {
      const owner = await createUser();
      const inquiry = await InquiryModel.create({
        userId: owner._id,
        title: "QA-TEST cancellable inquiry",
        message: "Original message",
        inquiryType: "GENERAL",
      });

      const token = await loginToken(owner.email);
      const response = await api()
        .patch(`/api/v1/inquiries/${inquiry._id}/cancel`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.data.status).toBe("CLOSED");
    });

    test("own inquiry endpoints require authentication", async () => {
      await api().get("/api/v1/inquiries/me").expect(401);
    });
  });

  describe("training enrollments", () => {
    async function createCourse() {
      const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      return TrainingCourseModel.create({
        title: `QA-TEST Course ${stamp}`,
        slug: `qa-test-course-${stamp}`,
        description: "QA-TEST course description",
        status: "PUBLISHED",
        isActive: true,
      });
    }

    test("an authenticated enrollment is linked to the caller", async () => {
      const user = await createUser();
      const course = await createCourse();
      const token = await loginToken(user.email);

      await api()
        .post("/api/v1/training-enrollments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          courseId: course._id.toString(),
          fullName: "QA-TEST Learner",
          email: user.email,
          phone: "9800000000",
        })
        .expect(201);

      const response = await api()
        .get("/api/v1/training-enrollments/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].courseTitle).toBe(course.title);
    });

    test("a guest enrollment is still accepted", async () => {
      const course = await createCourse();

      await api()
        .post("/api/v1/training-enrollments")
        .send({
          courseId: course._id.toString(),
          fullName: "QA-TEST Guest Learner",
          email: "qa-test-guest@example.com",
          phone: "9800000000",
        })
        .expect(201);
    });

    test("only a pending enrollment can be edited", async () => {
      const user = await createUser();
      const course = await createCourse();
      const enrollment = await TrainingEnrollmentModel.create({
        courseId: course._id,
        userId: user._id,
        name: "QA-TEST Learner",
        email: user.email,
        phone: "9800000000",
        status: "COMPLETED",
      });

      const token = await loginToken(user.email);
      await api()
        .patch(`/api/v1/training-enrollments/${enrollment._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ phone: "9811111111" })
        .expect(409);
    });

    test("cancelling a pending enrollment marks it cancelled", async () => {
      const user = await createUser();
      const course = await createCourse();
      const enrollment = await TrainingEnrollmentModel.create({
        courseId: course._id,
        userId: user._id,
        name: "QA-TEST Learner",
        email: user.email,
        phone: "9800000000",
      });

      const token = await loginToken(user.email);
      const response = await api()
        .patch(`/api/v1/training-enrollments/${enrollment._id}/cancel`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.data.status).toBe("CANCELLED");
    });

    test("another learner's enrollment is not readable", async () => {
      const user = await createUser();
      const stranger = await createUser();
      const course = await createCourse();
      const enrollment = await TrainingEnrollmentModel.create({
        courseId: course._id,
        userId: user._id,
        name: "QA-TEST Learner",
        email: user.email,
        phone: "9800000000",
      });

      const token = await loginToken(stranger.email);
      await api()
        .get(`/api/v1/training-enrollments/${enrollment._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });
  });

  describe("consulting leads", () => {
    test("an authenticated consulting request is linked to the caller", async () => {
      const user = await createUser();
      const token = await loginToken(user.email);

      await api()
        .post("/api/v1/consulting-leads")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contactName: "QA-TEST Owner",
          email: user.email,
          phone: "9800000000",
          businessName: "QA-TEST Lodge",
          message: "QA-TEST consulting message",
        })
        .expect(201);

      const response = await api()
        .get("/api/v1/consulting-leads/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].businessName).toBe("QA-TEST Lodge");
    });

    test("mobile consulting payloads exclude pipeline assignment", async () => {
      const user = await createUser();
      const admin = await createUser({ role: "admin" });
      const lead = await ConsultingLeadModel.create({
        userId: user._id,
        name: "QA-TEST Owner",
        email: user.email,
        phone: "9800000000",
        message: "QA-TEST consulting message",
        assignedTo: admin._id,
      });

      const token = await loginToken(user.email);
      const response = await api()
        .get(`/api/v1/consulting-leads/${lead._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.data.assignedTo).toBeUndefined();
      expect(response.body.data.userId).toBeUndefined();
    });

    test("a request already in negotiation cannot be edited", async () => {
      const user = await createUser();
      const lead = await ConsultingLeadModel.create({
        userId: user._id,
        name: "QA-TEST Owner",
        email: user.email,
        phone: "9800000000",
        message: "QA-TEST consulting message",
        status: "NEGOTIATION",
      });

      const token = await loginToken(user.email);
      await api()
        .patch(`/api/v1/consulting-leads/${lead._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ businessName: "QA-TEST Renamed" })
        .expect(409);
    });

    test("cancelling a new request marks it lost", async () => {
      const user = await createUser();
      const lead = await ConsultingLeadModel.create({
        userId: user._id,
        name: "QA-TEST Owner",
        email: user.email,
        phone: "9800000000",
        message: "QA-TEST consulting message",
      });

      const token = await loginToken(user.email);
      const response = await api()
        .patch(`/api/v1/consulting-leads/${lead._id}/cancel`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.data.status).toBe("LOST");
    });

    test("another user's consulting request is not readable", async () => {
      const user = await createUser();
      const stranger = await createUser();
      const lead = await ConsultingLeadModel.create({
        userId: user._id,
        name: "QA-TEST Owner",
        email: user.email,
        phone: "9800000000",
        message: "QA-TEST consulting message",
      });

      const token = await loginToken(stranger.email);
      await api()
        .get(`/api/v1/consulting-leads/${lead._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });
  });
});
