# Frontend Comment Standard

## Muc tieu | Goal
- Comment de giai thich "tai sao" va "rang buoc" cua code.
- Explain why a decision exists and the constraints behind it.
- Khong comment nhung gi code da noi ro (tranh noise).
- Do not comment what is already obvious in code.

## Quy tac | Rules
- Uu tien comment ngan, ro, 1-2 dong truoc khoi logic phuc tap.
- Keep comments concise, usually 1-2 lines near complex logic.
- Dung comment theo ngu canh nghiep vu (RBAC, responsive, state UI).
- Prefer comments with business/domain context (RBAC, responsive, UI state).
- Khi co workaround/han che ky thuat, bat buoc ghi ly do.
- For workarounds/limitations, document the reason explicitly.
- Khi co TODO, ghi dinh dang: `TODO(owner): noi dung`.
- Use TODO format: `TODO(owner): detail`.

## Nen comment o dau | Where to comment
- Mapping route/role, logic dieu huong, state chuyen doi giao dien.
- Route/role mapping, navigation behavior, and state transitions.
- Validation rule va edge case de nham lan.
- Validation rules and tricky edge cases.
- Cac gia tri magic (kich thuoc shell, mau status) neu co rang buoc.
- Magic values (shell sizes, status colors) when constrained.

## Khong nen comment | What to avoid
- Cac phep gan don gian.
- Simple assignments.
- JSX tu mo ta ro (vi du: "render title").
- Self-descriptive JSX (for example: "render title").
- Duplicate noi dung ten ham/bien.
- Repeating function or variable names.