import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { AppData, Company } from '../../../shared/types/domain'
import { companyFormSchema, type CompanyFormData } from '../../../shared/services/appDataSchema'
import { exportBackup, restoreBackup } from '../../../shared/services/localStorageService'
import { Button } from '../../../shared/components/ui/Button'
import { Field } from '../../../shared/components/ui/Field'
import { Icon } from '../../../shared/components/ui/Icon'

interface Props { data: AppData; onUpdate: (company: Company) => void; onRestore: (data: AppData) => void; onError: (message: string) => void }
export function SettingsPage({ data, onUpdate, onRestore, onError }: Props) {
  const [form, setForm] = useState<CompanyFormData>(data.company)
  const [error, setError] = useState('')
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const parsed = companyFormSchema.safeParse(form)
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Vérifiez vos paramètres.'); return }
    onUpdate(parsed.data)
  }
  return <><div className="page-heading"><div><div className="eyebrow">CONFIGURATION</div><h1>Paramètres</h1><p>Personnalisez la boutique et protégez vos données.</p></div></div>
    <div className="settings-grid"><section className="panel settings-panel"><div className="panel-head"><div><h2>Informations de la boutique</h2><p>Ces informations apparaissent dans votre espace.</p></div></div>
      <form className="settings-form" onSubmit={handleSubmit}><Field label="Nom de la boutique"><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })}/></Field>
        <Field label="Téléphone"><input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })}/></Field>
        <Field label="Devise"><select value={form.currency} onChange={(event) => setForm({ ...form, currency: event.target.value })}><option>FCFA</option><option>EUR</option><option>USD</option></select></Field>
        {error && <p className="form-error" role="alert">{error}</p>}<Button type="submit">Enregistrer les paramètres</Button></form>
    </section><DataBackup data={data} onRestore={onRestore} onError={onError}/></div>
    <section className="panel settings-panel firebase-panel"><div><span className="firebase-badge">STOCKAGE LOCAL</span><h2>Vos données restent dans ce navigateur</h2><p>Exportez une sauvegarde avant de changer d'appareil ou de navigateur. La synchronisation Firebase sera activée après configuration du projet.</p></div><span className="status-chip"><i/> Sauvegarde locale</span></section>
  </>
}

function DataBackup({ data, onRestore, onError }: { data: AppData; onRestore: (data: AppData) => void; onError: (message: string) => void }) {
  const handleRestore = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const result = await restoreBackup(file)
    if (!result.ok) { onError(result.error.message); return }
    onRestore(result.value)
  }
  return <section className="panel settings-panel"><div className="panel-head"><div><h2>Données et sauvegarde</h2><p>Créez une copie ou restaurez une sauvegarde G-stock.</p></div></div>
    <div className="storage-notice"><Icon name="alert"/><p>Effacer les données de navigation peut supprimer votre stock. Gardez une sauvegarde JSON à jour.</p></div>
    <Button variant="secondary" icon="download" onClick={() => exportBackup(data)}>Télécharger une sauvegarde</Button>
    <label className="btn-secondary restore-label">Restaurer une sauvegarde JSON<input type="file" accept="application/json,.json" onChange={handleRestore}/></label>
  </section>
}
