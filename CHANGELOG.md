# Changelog

## 3.0.0

Peer dependency bump: Blockly **12.x → 13.x**. Flydown interaction is intended to match 2.0.0.

### Preserved (same as 2.0.0 / Blockly 12)

- Hover-to-open, timeout, `mouseout` cancel, and `hideChaff` dismiss
- Flydown position, rounded path, block-tinted background CSS
- Custom `reflow` sizing (popup width/height, RTL shift)
- `position()` no-op (not docked to the toolbox edge)
- `autoHide` always closes this flydown (including `onlyClosePopups === true`), because it is a field popup, not the workspace toolbox flyout
- Toolbox flyout, trash, and main-workspace drag remain core Blockly’s responsibility
- Auto-close after a block is dragged out of the flydown (restored: v13 `BlockDragStrategy` no longer hides the flyout; we hide on target-workspace `BLOCK_CREATE` when `autoClose` is true)

### Custom methods kept on purpose

These were already unused on Blockly 12 (core had already renamed or moved the hooks). They are **not deleted**, so behavior cannot change by removing them:

- `onMouseMove_` — not on the v13 `Flyout` prototype
- `placeNewBlock_` — not on the v13 `Flyout` prototype; live clone/place is `BlockDragStrategy`
- `reflow`’s `block.flyoutRect_` branch — flyout mats were removed in core; the guard is a no-op

`placeNewBlock_` now uses `getToolbox()` when `toolbox_` is missing so the method would not throw if something called it. That path is still not used for drags.

### Cannot match Blockly 12 exactly (core, not this plugin)

| Area | Why |
| --- | --- |
| Keyboard navigation | Built into Blockly 13 by default. `show()` focuses flyout contents and sets ARIA. Mouse open/close is unchanged. |
| Drop position from the flydown | Already used core’s private `positionNewBlock` on v12 (`Flydown.placeNewBlock_` never ran). v13 uses `BlockDragStrategy.positionNewBlock` (screen ↔ workspace mapping). We did **not** wire the unused XML clone path, because that would change today’s drop, not preserve it. |
| Field keyboard/ARIA | Core `FieldInput` now has focus/ARIA hooks. This field is still mouse-only (`mouseover` / `mouseout`). |

### Other

- `blockly` peer/dev dependency: `^13.0.0` (dev pins `^13.2.1`)
- `@blockly/dev-scripts` / `@blockly/dev-tools` aligned to 13.x releases
- `browserslist`: dropped IE 11 (Blockly 13 requires Safari 15.4+)
- Package renamed to `@naviyra/blockly-field-flydown` (GitHub repo: `Rainbowmarket/blockly-field-flydown`)
