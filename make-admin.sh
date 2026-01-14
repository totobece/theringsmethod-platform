#!/bin/bash

# Script para hacer admin a un usuario de Duorings
# Uso: ./make-admin.sh email@duorings.com

if [ -z "$1" ]; then
  echo "❌ Error: Debes proporcionar un email"
  echo "Uso: ./make-admin.sh email@duorings.com"
  exit 1
fi

EMAIL="$1"

echo "🔐 Haciendo admin al usuario: $EMAIL"
echo ""

# Ejecutar el script de Node.js
node - <<EOF
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://shrswzchkqiobcikdfrn.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY no está configurada');
  console.error('Configúrala con: export SUPABASE_SERVICE_ROLE_KEY="tu-service-role-key"');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function makeAdmin() {
  try {
    console.log('🔍 Buscando usuario por email...');
    
    // Buscar usuario por email con paginación
    let user = null;
    let page = 1;
    const perPage = 1000;
    
    while (!user) {
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({
        page,
        perPage
      });
      
      if (listError) {
        console.error('❌ Error buscando usuarios:', listError.message);
        process.exit(1);
      }

      console.log(\`   Buscando en página \${page} (\${users.length} usuarios)...\`);

      user = users.find(u => u.email?.toLowerCase() === '${EMAIL}'.toLowerCase());

      if (user) {
        console.log('✅ Usuario encontrado!');
        break;
      }

      // Si no hay más usuarios, salir
      if (users.length < perPage) {
        console.error('❌ Usuario no encontrado:', '${EMAIL}');
        console.error('   Total de usuarios revisados:', page * perPage);
        console.error('   Verifica que el email sea correcto (case-sensitive en algunos casos)');
        process.exit(1);
      }

      page++;
    }

    // Actualizar metadata para agregar rol admin
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        role: 'admin'
      }
    });

    if (error) {
      console.error('❌ Error actualizando usuario:', error.message);
      process.exit(1);
    }

    console.log('✅ Usuario actualizado exitosamente:');
    console.log('   Email:', data.user.email);
    console.log('   ID:', data.user.id);
    console.log('   Role:', data.user.user_metadata.role);
    console.log('');
    console.log('🎉 El usuario ahora puede acceder a /admin/extend-trial');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

makeAdmin();
EOF
