import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession]   = useState(undefined) // undefined = carregando
  const [company, setCompany]   = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session?.user) { setCompany(null); return }
    supabase
      .from('companies')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle()
      .then(({ data }) => setCompany(data))
  }, [session])

  const signUp = async ({ email, password, cnpj, razaoSocial, phone, city, state }) => {
    // Company is created automatically via DB trigger on auth.users INSERT,
    // so we just need to pass the data as user metadata.
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { cnpj, razao_social: razaoSocial, phone, city, state },
      },
    })
    if (error) throw error
  }

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ session, company, signUp, signIn, signOut, loading: session === undefined }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
