# Actimo – Messages Feature: Test Plan

## Scope

This test plan covers the **Messages** feature in Actimo, focusing on:

1. Creating messages
2. Adding and configuring content modules
3. Setting up recipients and delivery channels
4. Publishing a message
5. Reviewing delivery results via analytics

---

## Test Scenarios

| ID     | Scenario                                                                 | Priority | Rationale                                                                                                    |
|--------|--------------------------------------------------------------------------|----------|--------------------------------------------------------------------------------------------------------------|
| TC-001 | Create a new message with a title and at least one text module           | Critical | Core creation flow; all other features depend on a message existing.                                         |
| TC-002 | Attempt to save/publish a message without a title                        | Critical | Title is a required field; blank titles should be caught with a clear validation error before publish.        |
| TC-003 | Add a text module and verify content is saved                            | High     | Text modules are the most common content type; content persistence is foundational.                           |
| TC-004 | Add a button module and configure a URL action                           | High     | Buttons drive CTA engagement; broken link config silently invalidates recipient experience.                   |
| TC-005 | Add an image module and verify image renders in the editor               | High     | Images are heavily used; upload/render failures are visually obvious and high-impact.                         |
| TC-006 | Add an NPS/Feedback module and configure question text                   | Medium   | Feedback modules enable two-way communication; misconfiguration yields unusable survey data.                  |
| TC-007 | Navigate between editor tabs (Design → Publish) and verify data persists   | High     | Auto-save must retain content when switching panels; data loss here directly affects the user workflow.       |
| TC-008 | Search for a recipient group and confirm selection                       | Critical | Messages with no valid recipients will not be delivered; recipient selection is a mandatory send step.        |
| TC-009 | Attempt to publish without selecting any recipient                | Critical | Recipient is required; a missing recipient means zero delivery.          |
| TC-010 | Toggle email, push, and SMS delivery channels on/off                     | High     | Each channel has distinct delivery behavior; toggling must accurately reflect user intent.                    |
| TC-011 | Schedule a message for future delivery and verify the scheduled time     | Medium   | Scheduled send is a common use case for campaigns; incorrect scheduling causes mistimed communication.        |
| TC-012 | Send a test/preview to a single contact before full publish              | High     | Preview send reduces errors reaching the full audience; a broken preview flow removes a safety net.           |
| TC-013 | Email Report   | Medium     | Reports recipient successfully received the report sent.    |
| TC-014 | Create advance report                                | Medium   | Send report per selected configuration      |
| TC-015 | Duplicate an existing message and verify it appears in the message list  | Medium   | Duplication speeds up content creation; failures here force manual recreation and waste time.                 |
| TC-016 | Delete a message and confirm it is removed from the message list         | Medium   | Delete is an irreversible action; confirm dialog and list update must both work correctly.                     |
| TC-017 | Add a second page to a message and verify page navigation in preview     | Low      | Multi-page messages are used for longer content; broken page linking breaks the reading flow for recipients.  |

---

## Prioritization Notes

**Critical** – Blocks core user journeys; broken = feature unusable.  
**High** – Significant impact on quality or common usage paths; broken = degraded experience.  
**Medium** – Important but not blocking; affects specific use cases or edge paths.  
**Low** – Rarely triggered or cosmetic impact; broken causes minor friction.

---

## Automated Test Cases (Part 2)

The following three test cases were selected for automation first based on priority and coverage value:

| ID     | File                                  | Reason for Selection                                             |
|--------|---------------------------------------|------------------------------------------------------------------|
| TC-001 | `tc001-create-message.spec.ts`        | Highest value; all other tests depend on message creation working|
| TC-002 | `tc002-add-content-modules.spec.ts`   | Covers the main editor loop users spend the most time in         |
| TC-003 | `tc003-configure-recipients.spec.ts`  | Guards the send gate; critical path before any delivery occurs   |
