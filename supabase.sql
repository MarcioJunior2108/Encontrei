-- ==========================================
-- SCRIPT SUPABASE: FASE 3 - AUTH & PROFILES
-- Cole este código no "SQL Editor" do Supabase e clique em "Run"
-- ==========================================

-- 1. Tabela de Perfis Base (Estendendo auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'CLIENT' CHECK (role IN ('CLIENT', 'PROFESSIONAL', 'ADMIN')),
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de Profissionais (Extensão do Perfil)
CREATE TABLE public.professionals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  headline TEXT,
  bio TEXT,
  verification_status TEXT DEFAULT 'UNVERIFIED' CHECK (verification_status IN ('UNVERIFIED', 'PENDING', 'VERIFIED')),
  availability TEXT DEFAULT 'AVAILABLE' CHECK (availability IN ('AVAILABLE', 'BUSY', 'UNAVAILABLE')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- HABILITANDO SEGURANÇA (RLS - ROW LEVEL SECURITY)
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;

-- Políticas de Profiles
-- Todo mundo pode ver perfis públicos
CREATE POLICY "Perfis são públicos para leitura." ON public.profiles FOR SELECT USING (true);
-- Usuário só pode editar o próprio perfil
CREATE POLICY "Usuários podem atualizar seus próprios perfis." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Políticas de Professionals
-- Todo mundo pode ver dados dos profissionais
CREATE POLICY "Profissionais são públicos para leitura." ON public.professionals FOR SELECT USING (true);
-- Apenas o dono do perfil profissional pode editá-lo
CREATE POLICY "Profissionais podem atualizar seus dados." ON public.professionals FOR UPDATE USING (auth.uid() = user_id);
-- Apenas o dono pode criar seu registro profissional
CREATE POLICY "Usuários podem criar seu perfil profissional." ON public.professionals FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- GATILHO AUTOMÁTICO DE CRIAÇÃO (TRIGGER)
-- Cria um perfil automaticamente quando usuário faz Cadastro (SignUp)
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'CLIENT')
  );

  -- Se for um profissional, já cria a tabela vazia para ele
  IF coalesce(new.raw_user_meta_data->>'role', '') = 'PROFESSIONAL' THEN
    INSERT INTO public.professionals (user_id) VALUES (new.id);
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atrela a função ao evento de INSERT do sistema de Auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
