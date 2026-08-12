'use client';

import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, MapPin, CheckCircle2, AlertTriangle, Users, FileSpreadsheet } from 'lucide-react';

interface ExtractedProfessional {
  id: string;
  name: string;
  phone: string;
  city: string;
  state: string;
  service: string;
  basePrice: number;
}

export default function ImportarMapsPage() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [defaultCity, setDefaultCity] = useState('');
  const [defaultService, setDefaultService] = useState('');

  const [extractedData, setExtractedData] = useState<ExtractedProfessional[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [importSuccess, setImportSuccess] = useState<{ imported: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    setError(null);
    setExtractedData([]);
    setImportSuccess(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rows = results.data as any[];
          
          if (rows.length === 0) {
            throw new Error('O arquivo CSV está vazio.');
          }

          // Tentar adivinhar as colunas baseadas em nomes comuns de exportação
          const firstRow = rows[0];
          const keys = Object.keys(firstRow).map(k => k.toLowerCase());
          
          const nameKey = Object.keys(firstRow).find(k => k.toLowerCase().includes('name') || k.toLowerCase().includes('title') || k.toLowerCase().includes('nome')) || keys[0];
          const phoneKey = Object.keys(firstRow).find(k => k.toLowerCase().includes('phone') || k.toLowerCase().includes('telefone'));
          const categoryKey = Object.keys(firstRow).find(k => k.toLowerCase().includes('category') || k.toLowerCase().includes('categoria') || k.toLowerCase().includes('type'));
          const addressKey = Object.keys(firstRow).find(k => k.toLowerCase().includes('address') || k.toLowerCase().includes('endereço') || k.toLowerCase().includes('endereco'));

          const parsedData: ExtractedProfessional[] = [];

          rows.forEach((row, index) => {
            let phone = phoneKey ? String(row[phoneKey] || '') : '';
            // Limpa o telefone mantendo apenas números e o +
            phone = phone.replace(/[^\d+]/g, '');

            // Só importar se tiver um número de telefone válido (pelo menos 10 dígitos)
            if (phone.length >= 10) {
              const name = nameKey ? String(row[nameKey] || 'Profissional Local') : 'Profissional Local';
              
              // Se o usuário digitou um Serviço Padrão, ele tem prioridade. Senão, usa o do CSV.
              const service = defaultService ? defaultService : (categoryKey ? String(row[categoryKey] || 'Serviços') : 'Serviços');
              
              // Se o usuário digitou uma Cidade Padrão, ela tem prioridade.
              let city = defaultCity || 'Sua Cidade';
              const address = addressKey ? String(row[addressKey] || '') : '';
              if (address && !defaultCity) {
                // Heurística muito simples para pegar a cidade se não foi forçada
                const parts = address.split('-');
                if (parts.length >= 2) {
                  const possibleCity = parts[parts.length - 2].trim().split(',').pop()?.trim();
                  if (possibleCity) city = possibleCity;
                }
              }

              parsedData.push({
                id: `csv-${index}`,
                name: name,
                phone: phone,
                city: city,
                state: 'BA', // Você pode parametrizar isso também
                service: service,
                basePrice: Math.floor(Math.random() * 100) + 50, // Preço base aleatório para o perfil sombra
              });
            }
          });

          if (parsedData.length === 0) {
            throw new Error('Nenhum profissional com número de telefone válido foi encontrado no CSV.');
          }

          setExtractedData(parsedData);
          setSelectedIds(new Set(parsedData.map(p => p.id)));
        } catch (err: any) {
          setError(err.message || 'Erro ao processar o arquivo CSV.');
        } finally {
          setIsExtracting(false);
          if (fileInputRef.current) fileInputRef.current.value = ''; // reseta o input
        }
      },
      error: (error) => {
        setError(`Erro ao ler CSV: ${error.message}`);
        setIsExtracting(false);
      }
    });
  };

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const handleImport = async () => {
    const selectedProfessionals = extractedData.filter(p => selectedIds.has(p.id));
    if (selectedProfessionals.length === 0) return;

    setIsImporting(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/import-professionals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer development-secret`
        },
        body: JSON.stringify(selectedProfessionals.map(({ id, ...rest }) => rest))
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao importar profissionais');
      }

      setImportSuccess({ imported: data.imported });
      setExtractedData([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Importar do Google Maps (CSV)</h1>
        <p className="text-[hsl(var(--muted-foreground))] mt-1">
          Faça o upload de uma planilha (CSV) gerada por uma extensão do Google Maps para criar Perfis Sombra instantaneamente.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
            Upload de Planilha CSV
          </CardTitle>
          <CardDescription>
            Recomendamos usar extensões gratuitas como "G Maps Extractor" ou "Instant Data Scraper" para gerar o arquivo CSV.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-1 block">Cidade Padrão (Opcional)</label>
              <Input 
                placeholder="Ex: Salvador" 
                value={defaultCity}
                onChange={(e) => setDefaultCity(e.target.value)}
              />
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Usado caso a planilha não tenha o endereço claro.</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Serviço Padrão (Opcional)</label>
              <Input 
                placeholder="Ex: Psicólogo" 
                value={defaultService}
                onChange={(e) => setDefaultService(e.target.value)}
              />
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Sobrescreve a categoria do Google Maps se preenchido.</p>
            </div>
          </div>

          <div 
            className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center transition-colors ${
              isExtracting ? 'border-emerald-500 bg-emerald-500/5' : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] hover:bg-[hsl(var(--muted))]'
            }`}
          >
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              disabled={isExtracting || isImporting}
            />
            
            {isExtracting ? (
              <>
                <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
                <h3 className="text-lg font-medium text-emerald-700 dark:text-emerald-400">Processando Planilha...</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Isso pode levar alguns segundos dependendo do tamanho.</p>
              </>
            ) : (
              <>
                <div className="h-12 w-12 rounded-full bg-[hsl(var(--primary-muted))] flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-[hsl(var(--primary))]" />
                </div>
                <h3 className="text-lg font-medium">Clique para selecionar o CSV</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1 mb-4">ou arraste o arquivo até aqui.</p>
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={isExtracting || isImporting}
                >
                  Selecionar Arquivo CSV
                </Button>
              </>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 rounded-md bg-destructive/10 text-destructive flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
          
          {importSuccess && (
            <div className="mt-4 p-4 rounded-md bg-emerald-500/10 text-emerald-600 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">Sucesso! {importSuccess.imported} profissionais foram importados da planilha e agora possuem um Perfil Sombra aguardando reivindicação.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {extractedData.length > 0 && (
        <Card className="border-emerald-500/20 shadow-sm">
          <CardHeader className="bg-emerald-500/5 border-b">
            <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <Users className="h-5 w-5" />
              Dados Encontrados na Planilha ({extractedData.length})
            </CardTitle>
            <CardDescription>
              Apenas contatos com número de telefone foram extraídos. Selecione quais deseja importar.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-sm text-left relative">
                <thead className="bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] uppercase text-xs sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-4 py-3 w-12 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.size === extractedData.length}
                        onChange={() => {
                          if (selectedIds.size === extractedData.length) {
                            setSelectedIds(new Set());
                          } else {
                            setSelectedIds(new Set(extractedData.map(p => p.id)));
                          }
                        }}
                        className="rounded border-[hsl(var(--border))] text-emerald-500 focus:ring-emerald-500"
                      />
                    </th>
                    <th className="px-4 py-3">Nome / Local</th>
                    <th className="px-4 py-3">Telefone</th>
                    <th className="px-4 py-3">Serviço</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[hsl(var(--border))]">
                  {extractedData.map((prof) => (
                    <tr 
                      key={prof.id} 
                      className={`hover:bg-[hsl(var(--muted))] transition-colors cursor-pointer ${selectedIds.has(prof.id) ? 'bg-emerald-500/5' : ''}`}
                      onClick={() => toggleSelection(prof.id)}
                    >
                      <td className="px-4 py-4 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.has(prof.id)}
                          onChange={() => toggleSelection(prof.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded border-[hsl(var(--border))] text-emerald-500 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-[hsl(var(--foreground))] truncate max-w-[250px]" title={prof.name}>{prof.name}</div>
                        <div className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1 mt-1 truncate max-w-[250px]">
                          <MapPin className="h-3 w-3 shrink-0" /> {prof.city}, {prof.state}
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono text-sm whitespace-nowrap">{prof.phone}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[hsl(var(--primary-muted))] text-[hsl(var(--primary))] truncate max-w-[200px]" title={prof.service}>
                          {prof.service}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="bg-[hsl(var(--muted))] flex justify-between items-center p-4">
            <div className="text-sm text-[hsl(var(--muted-foreground))]">
              {selectedIds.size} de {extractedData.length} selecionados
            </div>
            <Button 
              onClick={handleImport} 
              disabled={selectedIds.size === 0 || isImporting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isImporting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Importando...</>
              ) : (
                `Importar Selecionados (${selectedIds.size})`
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
