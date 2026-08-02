# Route acceptance matrix

| Route | Direct load | Content | Navigation | No errors | Responsive | Result |
| --- | --- | --- | --- | --- | --- | --- |
| `/deliveries` | PASS | PASS | PASS | PASS | PASS | PASS |
| Editorial Package | PASS | PASS | PASS | PASS | PASS | PASS |
| Campaign Package | PASS | PASS | PASS | PASS | PASS | PASS |
| Scientific Package | PASS | PASS | PASS | PASS | PASS | PASS |
| Institutional Package | PASS | PASS | PASS | PASS | PASS | PASS |
| Research Package | PASS | PASS | PASS | PASS | PASS | PASS |
| `/deliveries/new` | PASS | Fallback | PASS | PASS | PASS | PASS |
| Unknown Package | PASS | Fallback | PASS | PASS | PASS | PASS |

The six valid routes were loaded and refreshed at all four required viewports.
The desktop fallback sweep also covered `/deliveries/non-existent-package`.
