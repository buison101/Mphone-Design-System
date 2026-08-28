# Component contract

Every component must document purpose, variants, states, content rules, accessibility, responsive behavior, platform mapping, and change history.

## V1 inventory

- Actions: Button, IconButton, Link, segmented control.
- Input: Field, Input, Select, Combobox, Checkbox, Radio, Switch.
- Feedback: Alert, Toast, Tooltip, Modal, Drawer, progress, content state.
- Navigation: AppShell, side navigation, app bar, tabs, breadcrumbs, pagination, bottom navigation.
- Data: MetricCard, MainCard, StatusBadge, DataTable, DescriptionList, chart container.
- Mobile telecom: DialpadKey, CallAction, CallStatus, ContactRow, CallHistoryRow, BottomSheet.

## Required states

Default, hover where applicable, focus, pressed, selected, disabled, loading, invalid, read-only, empty, error, offline, and permission denied.

## Content state

Empty states should not reserve chart-sized blank space unless the surrounding layout would otherwise jump. State text explains what happened and provides a recovery action when one exists.

