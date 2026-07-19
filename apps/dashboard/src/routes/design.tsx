import { For } from "solid-js";
import { PageShell } from "../components/page-shell/PageShell";
import { Stack } from "../components/stack/Stack";
import { Button } from "../components/button/Button";
import { TextInput } from "../components/text-input/TextInput";
import { TableRow } from "../components/table-row/TableRow";
import { Badge } from "../components/badge/Badge";
import { Alert } from "../components/alert/Alert";
import { Switch } from "../components/switch/Switch";
import { Checkbox } from "../components/checkbox/Checkbox";
import { Mail, ShieldAlert, Terminal, Info, Settings, Search, Trash2, Check, AlertTriangle, AlertCircle } from "lucide-solid";

export default function DesignPreview() {
  return (
    <PageShell title="Design System Preview">
      <Stack space="8">
        
        {/* Typography */}
        <section>
          <h2 style={{ "margin-bottom": "var(--dm-space-4)", "font-size": "var(--dm-font-size-lg)" }}>Typography</h2>
          <Stack space="2">
            <h1>Heading 1 - Inter Bold</h1>
            <h2>Heading 2 - Inter Bold</h2>
            <h3>Heading 3 - Inter Bold</h3>
            <h4>Heading 4 - Inter Bold</h4>
            <p>Body - Inter Regular. This dashboard is intended to be a sleek, futuristic, and magical command center. It leverages generous whitespace, rounded corners, and subtle shadows. The design relies heavily on precise contrasts and perfect spacing.</p>
          </Stack>
        </section>

        {/* Spacing, Radius, Elevation */}
        <section>
          <h2 style={{ "margin-bottom": "var(--dm-space-6)", "font-size": "var(--dm-font-size-xl)" }}>Design Tokens</h2>
          
          <Stack space="8">
            {/* Spacing Table */}
            <div>
              <h3 style={{ "margin-bottom": "var(--dm-space-3)", "font-size": "var(--dm-font-size-lg)" }}>Spacing</h3>
              <p style={{ "margin-bottom": "var(--dm-space-4)", "color": "var(--dm-color-muted-foreground)" }}>A strict 4px grid system for consistent rhythm and layout.</p>
              
              <div style={{ border: "var(--dm-border-width-base) solid var(--dm-color-border)", "border-radius": "var(--dm-radius-md)", overflow: "hidden" }}>
                <TableRow isHeader>
                  <div style={{ width: "150px" }}>Token</div>
                  <div style={{ width: "100px" }}>Pixels</div>
                  <div style={{ flex: "1" }}>Preview</div>
                </TableRow>
                
                <For each={[
                  { token: '1', px: '4px' },
                  { token: '2', px: '8px' },
                  { token: '3', px: '12px' },
                  { token: '4', px: '16px' },
                  { token: '5', px: '24px' },
                  { token: '6', px: '32px' },
                  { token: '8', px: '48px' },
                  { token: '10', px: '64px' },
                ]}>
                  {(space) => (
                    <TableRow>
                      <div style={{ width: "150px", "font-family": "monospace", "font-size": "var(--dm-font-size-sm)", "color": "var(--dm-color-primary)" }}>--dm-space-{space.token}</div>
                      <div style={{ width: "100px", "color": "var(--dm-color-muted-foreground)", "font-size": "var(--dm-font-size-sm)" }}>{space.px}</div>
                      <div style={{ flex: "1", display: "flex", "align-items": "center" }}>
                        <div style={{ width: `var(--dm-space-${space.token})`, height: "16px", "background-color": "hsl(var(--dm-primary-hsl) / 0.5)", "border-radius": "2px" }}></div>
                      </div>
                    </TableRow>
                  )}
                </For>
              </div>
            </div>

            {/* Radius Grid */}
            <div>
              <h3 style={{ "margin-bottom": "var(--dm-space-3)", "font-size": "var(--dm-font-size-lg)" }}>Border Radius</h3>
              <div style={{ display: "grid", "grid-template-columns": "repeat(auto-fill, minmax(150px, 1fr))", gap: "var(--dm-space-4)" }}>
                <For each={[
                  { name: 'sm', px: '4px' },
                  { name: 'md', px: '8px' },
                  { name: 'lg', px: '12px' },
                  { name: 'pill', px: '9999px' },
                ]}>
                  {(radius) => (
                    <div style={{ 
                      "border-radius": `var(--dm-radius-${radius.name})`, 
                      border: "var(--dm-border-width-base) solid var(--dm-color-border)", 
                      padding: "var(--dm-space-4)", 
                      "text-align": "center", 
                      "background-color": "var(--dm-color-surface)",
                      "box-shadow": "var(--dm-shadow-sm)"
                    }}>
                      <div style={{ "margin-bottom": "var(--dm-space-1)", "font-family": "monospace", "font-size": "var(--dm-font-size-sm)", "font-weight": "var(--dm-font-weight-bold)" }}>{radius.name}</div>
                      <div style={{ "color": "var(--dm-color-muted-foreground)", "font-size": "var(--dm-font-size-xs)" }}>{radius.px}</div>
                    </div>
                  )}
                </For>
              </div>
            </div>

            {/* Elevation Cards */}
            <div>
              <h3 style={{ "margin-bottom": "var(--dm-space-3)", "font-size": "var(--dm-font-size-lg)" }}>Elevation</h3>
              <div style={{ 
                display: "grid", 
                "grid-template-columns": "repeat(auto-fill, minmax(220px, 1fr))", 
                gap: "var(--dm-space-6)", 
                padding: "var(--dm-space-8)", 
                "background-color": "var(--dm-color-surface)", 
                "border-radius": "var(--dm-radius-lg)", 
                border: "var(--dm-border-width-base) solid var(--dm-color-border)" 
              }}>
                
                <For each={[
                  { name: 'sm', desc: 'Buttons, inputs, toggles' },
                  { name: 'base', desc: 'Cards, list items' },
                  { name: 'md', desc: 'Dropdowns, popovers' },
                  { name: 'lg', desc: 'Modals, dialogs' },
                ]}>
                  {(shadow) => (
                    <div style={{ 
                      "box-shadow": `var(--dm-shadow-${shadow.name})`, 
                      "background-color": "var(--dm-color-bg)", 
                      padding: "var(--dm-space-5)", 
                      "border-radius": "var(--dm-radius-md)", 
                      border: "var(--dm-border-width-base) solid var(--dm-color-border)",
                      display: "flex",
                      "flex-direction": "column",
                      gap: "var(--dm-space-1)"
                    }}>
                      <span style={{ "font-family": "monospace", "font-size": "var(--dm-font-size-sm)", "font-weight": "var(--dm-font-weight-bold)" }}>shadow-{shadow.name}</span>
                      <span style={{ "font-size": "var(--dm-font-size-xs)", "color": "var(--dm-color-muted-foreground)" }}>{shadow.desc}</span>
                    </div>
                  )}
                </For>

              </div>
            </div>

          </Stack>
        </section>

        {/* Buttons */}
        <section>
          <h2 style={{ "margin-bottom": "var(--dm-space-4)", "font-size": "var(--dm-font-size-lg)" }}>Buttons</h2>
          <Stack space="4">
            <div>
              <p style={{ "margin-bottom": "var(--dm-space-2)", "color": "var(--dm-color-muted-foreground)", "font-size": "var(--dm-font-size-sm)" }}>Variants</p>
              <div style={{ display: "flex", gap: "16px", "flex-wrap": "wrap" }}>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="tertiary">Tertiary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger Outline</Button>
              </div>
            </div>
            
            <div>
              <p style={{ "margin-bottom": "var(--dm-space-2)", "color": "var(--dm-color-muted-foreground)", "font-size": "var(--dm-font-size-sm)" }}>Sizes & Icons</p>
              <div style={{ display: "flex", gap: "16px", "flex-wrap": "wrap", "align-items": "center" }}>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button variant="primary"><Settings size={18} /> With Icon</Button>
                <Button variant="outline" size="icon"><Trash2 size={18} /></Button>
              </div>
            </div>
          </Stack>
        </section>

        {/* Badges */}
        <section>
          <h2 style={{ "margin-bottom": "var(--dm-space-4)", "font-size": "var(--dm-font-size-lg)" }}>BADGES</h2>
          <div style={{ display: "flex", gap: "16px", "flex-wrap": "wrap" }}>
            <Badge variant="default">Neutral</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success"><Check size={14} /> Success</Badge>
            <Badge variant="warning"><AlertTriangle size={14} /> Warning</Badge>
            <Badge variant="danger"><AlertCircle size={14} /> Danger</Badge>
            <Badge variant="primary"><Info size={14} /> Info</Badge>
          </div>
        </section>

        {/* Alerts */}
        <section>
          <h2 style={{ "margin-bottom": "var(--dm-space-4)", "font-size": "var(--dm-font-size-lg)" }}>ALERTS</h2>
          <Stack space="3">
            <Alert variant="success" icon={<Check />} title="Saved">
              Your changes have been synced.
            </Alert>
            <Alert variant="warning" icon={<AlertTriangle />} title="Storage almost full">
              You've used 92% of your quota.
            </Alert>
            <Alert variant="danger" icon={<AlertCircle />} title="Payment failed">
              We couldn't process your card.
            </Alert>
          </Stack>
        </section>

        {/* Forms */}
        <section>
          <h2 style={{ "margin-bottom": "var(--dm-space-4)", "font-size": "var(--dm-font-size-lg)" }}>Forms & Controls</h2>
          <div style={{ display: "grid", "grid-template-columns": "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px" }}>
            <Stack space="4">
              <TextInput label="Email Address" type="email" placeholder="agent@daruma.nz" />
              <TextInput label="Search" icon={<Search />} placeholder="Search projects..." />
              <TextInput label="API Key" type="password" placeholder="••••••••" error="API Key is invalid" />
            </Stack>
            <Stack space="4">
              <Switch label="Enable Notifications" />
              <Switch label="Dark Mode" checked />
              <Checkbox label="Accept Terms" description="You agree to our Terms of Service and Privacy Policy." />
              <Checkbox label="Subscribe to Newsletter" />
            </Stack>
          </div>
        </section>

      </Stack>
    </PageShell>
  );
}
