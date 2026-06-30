# Language-Learning AI MVP Checklist

Use this for WhatsApp or web MVPs that generate language-learning exercises and track learner progress. Keep the first paid phase narrow: one level, one exercise type, fake data first, educator review before expansion.

## Phase 1 Scope

- Confirm target language, level, exam/rubric and one exercise type.
- Capture learner intake through WhatsApp opt-in or a simple web form.
- Store learner profile, attempts, feedback and progress in Airtable or an equivalent client-approved table.
- Generate one exercise and one correction/feedback flow with an AI provider.
- Route uncertain, low-confidence or sensitive outputs to educator/admin review.
- Deliver test cases, runbook and phase-2 backlog.

## Intake Questions

- What exam, level and rubric define success?
- Which learner fields are required before generating exercises?
- Does the client already have WhatsApp Business Cloud API or an approved provider?
- Is Airtable already approved for learner data, or should the prototype use fake data only?
- Who reviews generated exercises and corrections before learner-facing use?
- What should happen when the model is uncertain or the student gives off-topic input?

## Airtable Base

### Learners

- `learner_id`
- `name_or_alias`
- `target_level`
- `language`
- `goal`
- `consent_status`
- `created_at`

### Exercise Attempts

- `attempt_id`
- `learner_id`
- `exercise_type`
- `prompt_version`
- `student_answer`
- `ai_feedback`
- `score_band`
- `educator_review_status`
- `created_at`

### Progress Events

- `event_id`
- `learner_id`
- `event_type`
- `level`
- `summary`
- `next_action`
- `created_at`

## B1 Exercise Schema

```json
{
  "exercise_type": "email_reply",
  "level": "B1",
  "instructions": "Write a short reply using the required situation and tone.",
  "rubric": ["task_completion", "grammar", "vocabulary", "coherence"],
  "student_answer": "",
  "feedback": {
    "strengths": [],
    "corrections": [],
    "next_practice": ""
  },
  "review_required": true
}
```

## WhatsApp / Web Flow

1. Learner opts in and confirms the learning goal.
2. Bot asks for level, target exam and exercise preference.
3. System generates one exercise from the approved rubric.
4. Learner submits an answer.
5. AI drafts feedback and assigns a score band.
6. Educator/admin reviews before production use or when confidence is low.
7. Progress event is logged and next practice is suggested.

## Acceptance Tests

- Fake learner can complete intake without exposing real PII.
- One B1 exercise is generated from a fixed rubric.
- Student answer is logged against the correct learner record.
- AI feedback includes corrections and next practice, not unsupported certification claims.
- Review-required flag works for low-confidence or sensitive cases.
- WhatsApp copy includes opt-in, fallback and human-review language.
- Runbook explains credential ownership, provider setup and phase-2 expansion.

## Guardrails

- Do not use real learner data before contract and secure access.
- Do not collect unnecessary sensitive data.
- Do not promise exam passing, autonomous grading accuracy or official certification.
- Do not use unofficial WhatsApp automation when an approved provider is required.
- Keep provider keys, Airtable tokens and WhatsApp credentials out of Markdown, chat and screenshots.
