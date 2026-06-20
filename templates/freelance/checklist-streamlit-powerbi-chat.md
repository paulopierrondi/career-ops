# Streamlit + Power BI Chat Delivery Checklist

Use for opportunities that ask Paulo to build a chat interface over Power BI reports or BI data.

## Positioning

Sell a small first version that reads a safe dataset and answers scoped business questions. Avoid promising direct reasoning over a complex Power BI semantic model before seeing the data model.

Default first phase:
- inspect the report/data source shape;
- export or connect one safe dataset;
- build Streamlit chat UI;
- add data dictionary and query guardrails;
- test against expected business questions.

## Discovery Questions

1. Is the data inside Power BI, Excel/CSV, SQL, API or another source?
2. Is Power BI Service/API access available, or should the first version use exported data?
3. What are the top 10 questions users need to ask?
4. Which columns are sensitive or should never be exposed?
5. Should the chat answer from raw data, a semantic layer or precomputed metrics?
6. Does the client need login/auth?
7. Should answers include charts, tables, source rows or plain text?
8. How fresh must the data be?
9. Who validates whether answers are correct?

## Access Boundaries

- Prefer redacted CSV/XLSX sample or synthetic data for proof of concept.
- Do not store client datasets in repo/Vault.
- Do not ask for Power BI credentials in chat.
- Document limitations if using exported data instead of live Power BI API.

## Architecture Skeleton

```text
Power BI / data source
  -> export, API or database connector
  -> data normalization
  -> data dictionary + metric definitions
  -> Streamlit chat UI
  -> query planner / scoped prompt
  -> answer + table/chart evidence
  -> validation log
```

## Implementation Steps

1. Get sample schema and 5-10 sample rows, redacted if needed.
2. Define metric names, units, filters and date fields.
3. Create a Streamlit layout with chat input, answer area and evidence table.
4. Load data from CSV/XLSX/API/database depending on agreed first phase.
5. Restrict questions to available columns and approved metrics.
6. Add refusal for unsupported questions.
7. Add source evidence: rows, aggregation table or chart.
8. Test against the top 10 expected questions.
9. Write handoff with data refresh options.

## Guardrails

- Do not let the model invent metrics.
- Do not answer from hidden columns.
- For aggregations, show the calculation basis.
- Flag stale data.
- Keep PII out of prompts and logs.
- Use deterministic calculations in code when possible; use the LLM to explain, not to calculate blindly.

## Test Plan

| Test | Expected result |
|---|---|
| Known metric question | Correct numeric answer with basis |
| Filtered question | Correct filter applied |
| Unsupported metric | Chat says metric is not available |
| Ambiguous date range | Chat asks clarification |
| Sensitive column request | Chat refuses or redacts |
| Empty dataset | Safe error message |
| Refresh needed | Data freshness is visible |

## Proposal Snippet

```text
Eu faria uma primeira versao em Streamlit conectada a uma amostra ou export seguro do relatorio, com dicionario de dados, perguntas suportadas, respostas com evidencia e guardrails para o modelo nao inventar metricas. Depois validamos se vale conectar direto ao Power BI/API ou banco.
```

## Handoff Deliverables

- Data dictionary.
- Supported question list.
- Streamlit app structure.
- Data loading method.
- Metric calculation notes.
- Test results.
- Refresh/API roadmap.
