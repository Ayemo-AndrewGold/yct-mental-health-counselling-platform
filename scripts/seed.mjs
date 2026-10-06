// Seed script — registers 50 counsellors + 500 students directly against the backend.
// Run: node scripts/seed.mjs <admin_email> <admin_password>
// Example: node scripts/seed.mjs admin@yabatech.edu.ng admin123

const BASE         = 'http://127.0.0.1:8000/api/auth';
const ADMIN_EMAIL  = 'admin@yct.edu.ng';
const ADMIN_PASS   = '123456789';

// ─── 50 COUNSELLORS ───────────────────────────────────────────────────────────
const COUNSELLORS = [
  { full_name:'Dr. Adaeze Okonkwo',       specialisation:'Academic Stress & Anxiety'                  },
  { full_name:'Mr. Emeka Nwosu',          specialisation:'Depression & Mood Disorders'                 },
  { full_name:'Mrs. Fatima Abdullahi',    specialisation:'Crisis Intervention'                         },
  { full_name:'Dr. Chukwuemeka Eze',      specialisation:'Suicidal Ideation & Safety Planning'         },
  { full_name:'Ms. Aisha Bello',          specialisation:'Anxiety & Panic Disorders'                   },
  { full_name:'Mr. Seun Adeyemi',         specialisation:'Substance Abuse Counselling'                 },
  { full_name:'Mrs. Ngozi Okafor',        specialisation:'Grief & Bereavement'                         },
  { full_name:'Dr. Tunde Lawal',          specialisation:'Relationship & Family Issues'                },
  { full_name:'Ms. Kemi Adeleke',         specialisation:'Self-Esteem & Identity'                      },
  { full_name:'Mr. Biodun Olawale',       specialisation:'Trauma & PTSD'                               },
  { full_name:'Mrs. Amaka Nwachukwu',     specialisation:'Sleep Disorders & Stress'                    },
  { full_name:'Dr. Yusuf Ibrahim',        specialisation:'Attention Deficit & Learning Difficulties'   },
  { full_name:'Ms. Chidinma Obi',         specialisation:'Social Anxiety & Phobias'                    },
  { full_name:'Mr. Victor Alomaja',       specialisation:'Academic Performance Counselling'             },
  { full_name:'Mrs. Blessing Eniola',     specialisation:'Eating Disorders & Body Image'                },
  { full_name:'Dr. Kunle Fashola',        specialisation:'Generalised Anxiety Disorder'                 },
  { full_name:'Ms. Rukayat Suleiman',     specialisation:'Peer Pressure & Bullying'                    },
  { full_name:'Mr. Emeka Osei',           specialisation:'Career Counselling & Motivation'              },
  { full_name:'Mrs. Toyin Babatunde',     specialisation:'Domestic Abuse Counselling'                   },
  { full_name:'Dr. Samuel Ehigie',        specialisation:'Psychosis & Severe Mental Illness'            },
  { full_name:'Ms. Hafsat Musa',          specialisation:'Cultural & Religious Adjustment'              },
  { full_name:'Mr. Taiwo Ogundimu',       specialisation:'Financial Stress & Poverty'                  },
  { full_name:'Mrs. Chinwe Nzeka',        specialisation:'Depression & Loneliness'                     },
  { full_name:'Dr. Olumide Bakare',       specialisation:'Mindfulness & Cognitive Behavioural Therapy' },
  { full_name:'Ms. Ifeoma Ugwu',          specialisation:'Anger Management'                            },
  { full_name:'Mr. Babatunde Salako',     specialisation:'Anxiety & Academic Burnout'                  },
  { full_name:'Mrs. Adunola Adebakin',    specialisation:'Sexual Health & Relationships'                },
  { full_name:'Dr. Nkechi Okonkwo',       specialisation:"Postpartum & Women's Mental Health"          },
  { full_name:'Mr. Femi Adebisi',         specialisation:'Addiction & Recovery Counselling'             },
  { full_name:'Ms. Zainab Yusuf',         specialisation:'Stress Resilience & Coping Skills'            },
  { full_name:'Mrs. Patience Ogu',        specialisation:'Childhood Trauma & Abuse Recovery'            },
  { full_name:'Dr. Kayode Adeleke',       specialisation:'Neurodevelopmental Disorders'                 },
  { full_name:'Mr. Chibuzo Eze',          specialisation:'Crisis Intervention & Hotline Support'        },
  { full_name:'Ms. Funmi Oladapo',        specialisation:'Depression & Social Withdrawal'               },
  { full_name:'Mrs. Hadiza Shehu',        specialisation:'Emotional Regulation & DBT'                   },
  { full_name:'Dr. Obiora Aneke',         specialisation:'Psychosomatic Disorders'                      },
  { full_name:'Mr. Gbenga Adeyinka',      specialisation:'Exam Anxiety & Test Stress'                   },
  { full_name:'Ms. Adaeze Ibe',           specialisation:'Grief Counselling & Loss'                     },
  { full_name:'Mrs. Suliat Balogun',      specialisation:'Bipolar Disorder & Mood Swings'               },
  { full_name:'Dr. Osita Nzeka',          specialisation:'Schizophrenia & Psychotic Disorders'          },
  { full_name:'Mr. Dare Akinwale',        specialisation:'Phobias & Exposure Therapy'                   },
  { full_name:'Ms. Chioma Okonkwo',       specialisation:'Adjustment Disorder & Life Transitions'       },
  { full_name:'Mrs. Bimbo Ajibade',       specialisation:'Interpersonal Therapy & Social Skills'        },
  { full_name:'Dr. Taiwo Damilola',       specialisation:'Obsessive Compulsive Disorder'                },
  { full_name:'Mr. Rotimi Fadeyi',        specialisation:'Depression & Suicidal Prevention'             },
  { full_name:'Ms. Nneka Okezie',         specialisation:'Sexual Abuse & Trauma Recovery'               },
  { full_name:'Mrs. Folake Adeleye',      specialisation:'Parenting & Family Stress'                    },
  { full_name:'Dr. Ezeobiora Chukwu',     specialisation:'Personality Disorders'                        },
  { full_name:'Mr. Segun Olawumi',        specialisation:'Mindfulness-Based Stress Reduction'           },
  { full_name:'Ms. Uche Okafor',          specialisation:'Academic Failure & Dropout Prevention'        },
];

// ─── 500 STUDENTS DATA ────────────────────────────────────────────────────────
const FIRST = ['Adaeze','Emeka','Fatima','Chukwuemeka','Aisha','Seun','Ngozi','Tunde','Kemi','Biodun','Amaka','Yusuf','Chidinma','Victor','Blessing','Kunle','Rukayat','Gbenga','Toyin','Samuel','Hafsat','Taiwo','Chinwe','Olumide','Ifeoma','Babatunde','Adunola','Nkechi','Femi','Zainab','Patience','Kayode','Chibuzo','Funmi','Hadiza','Obiora','Dare','Chioma','Bimbo','Nneka','Folake','Segun','Uche','Chidi','Amara','Jide','Opeyemi','Sola','Bola','Ade','Olu','Dami','Temi','Yemi','Bisi','Wole','Lekan','Tope','Lola','Dele','Seyi','Remi','Ayo','Lanre','Gbemi','Tobi','Wemi','Dayo','Nike','Shade','Sade','Ronke','Bunmi','Yinka','Deji','Tunji','Kolade','Dapo','Goke','Akin','Tokunbo','Dupe','Yetunde','Modupe','Abike','Kehinde','Temitope','Iyabo','Rasaki','Jamiu','Wasiu','Kazeem','Lawal','Mukaila','Sulaimon','Taofik','Raheem','Bashir','Musa','Usman','Abdullahi','Sadiya','Asmau','Hauwa','Khadija','Mariam','Zahra','Halima','Chinyere','Obiageli','Uchechi','Adaora','Chiamaka','Uchenna','Ifunanya','Oluchi','Ebele','Nma','Ikenna','Obinna','Onyeka','Ugochukwu','Chinedu','Nnamdi','Chukwudi','Ogechukwu','Somto','Kosi','Effiong','Bassey','Asuquo','Etim','Okon','Edet','Inyang','Nsikak','Eno','Arit','Ovie','Oghene','Okoro','Edafe','Ejiro','Ese','Ufuoma','Isioma','Ifeanyi','Onyedika','Chukwuebuka','Amaechi','Obioma','Tobechukwu','Adachukwu','Chizaram','Pelumi','Ireoluwa','Ayomide','Moyinoluwa','Oluwasegun','Oluwakemi','Oluwabunmi','Abimbola','Adewunmi','Adedayo','Adeola','Adeyemi','Adewale','Adebimpe','Adebayo','Adebola','Adekunle','Ifedayo','Ifeoluwa','Grace','Faith','Hope','Joy','Mercy','Peace','Charity','Glory'];
const LAST  = ['Okonkwo','Nwosu','Abdullahi','Eze','Bello','Adeyemi','Okafor','Lawal','Adeleke','Olawale','Nwachukwu','Ibrahim','Obi','Alomaja','Eniola','Fashola','Suleiman','Osei','Babatunde','Ehigie','Musa','Ogundimu','Nzeka','Bakare','Ugwu','Salako','Adebakin','Adebisi','Yusuf','Ogu','Nweke','Adeyemo','Adewale','Adelaja','Adewumi','Adeniyi','Adetunji','Adedeji','Adekola','Olayinka','Olawuyi','Olasinde','Olatunji','Olawumi','Oladeji','Olayemi','Olanrewaju','Olawoye','Olajide','Abubakar','Usman','Garba','Sani','Umar','Aliyu','Mohammed','Hassan','Idris','Bassey','Effiong','Edet','Inyang','Etim','Asuquo','Nsikak','Eno','Ekaette','Ovie','Edafe','Ejiro','Ese','Ufuoma','Olusegun','Oluwaseun','Oluwafemi','Oluwaseyi','Oluwatobi','Oluwakayode','Oluwatunde','Oluwatoyin','Oluwabukola','Fadeyi','Okezie','Adeleye','Chukwu','Olawumi','Akinwale','Ajibade','Damilola','Balogun','Aneke','Adeyinka','Ibe'];
const DEPTS = ['Computer Technology','Electrical Engineering','Mass Communication','Business Administration','Accountancy','Food Technology','Science Lab Technology','Civil Engineering','Mechanical Engineering','Marketing','Banking and Finance','Hospitality Management'];
const LVLS  = ['ND1FT','ND1PT','ND2FT','ND2PT','HND1FT','HND1PT','HND2FT','HND2PT'];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pad(n, len) { return String(n).padStart(len, '0'); }

function makeStudents(count) {
  const seen = new Set();
  const list = [];
  let attempts = 0;
  while (list.length < count && attempts < count * 5) {
    attempts++;
    const fn = rand(FIRST), ln = rand(LAST);
    const num = pad(list.length + 1, 4);
    const email = `${fn.toLowerCase()}${ln.toLowerCase().slice(0,3)}${num}@yabatech.edu.ng`;
    if (seen.has(email)) continue;
    seen.add(email);
    const matric = `P/ND/23/${pad(3210000 + list.length + 1, 7)}`;
    list.push({ full_name:`${fn} ${ln}`, email, matric_number:matric, department:rand(DEPTS), level:rand(LVLS) });
  }
  return list;
}

const STUDENTS = makeStudents(500);

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function makeEmail(fullName) {
  const cleaned = fullName.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s*/i, '').trim();
  return cleaned.split(' ')[0].toLowerCase() + '@yabatech.edu.ng';
}

async function post(url, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { method:'POST', headers, body: JSON.stringify(body) });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data: json };
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🔐  Logging in as admin (${ADMIN_EMAIL})…`);

  // 1. Get admin token
  const login = await post(`${BASE}/login/`, { email: ADMIN_EMAIL, password: ADMIN_PASS });
  if (!login.ok) {
    console.error('❌  Login failed:', JSON.stringify(login.data));
    process.exit(1);
  }
  const token = login.data?.tokens?.access ?? login.data.access ?? login.data.token ?? login.data.access_token;
  if (!token) {
    console.error('❌  No access token in response:', JSON.stringify(login.data));
    process.exit(1);
  }
  console.log('✅  Logged in. Token received.\n');

  // ── 2. Create 50 counsellors ──────────────────────────────────────────────
  console.log(`👨‍⚕️  Creating ${COUNSELLORS.length} counsellors…`);
  let cOk = 0, cSkip = 0, cErr = 0;
  for (let i = 0; i < COUNSELLORS.length; i++) {
    const c   = COUNSELLORS[i];
    const res = await post(`${BASE}/create-counsellor/`, {
      full_name: c.full_name,
      email:     makeEmail(c.full_name),
      password:  '123456789',
      role:      'counsellor',
    }, token);

    if (res.ok) {
      cOk++;
      process.stdout.write(`  ✓ [${i+1}/${COUNSELLORS.length}] ${c.full_name}\n`);
    } else if (res.status === 400) {
      cSkip++;
      process.stdout.write(`  ↷ [${i+1}/${COUNSELLORS.length}] ${c.full_name} — already exists\n`);
    } else {
      cErr++;
      process.stdout.write(`  ✗ [${i+1}/${COUNSELLORS.length}] ${c.full_name} — ${JSON.stringify(res.data)}\n`);
    }
    await sleep(100);
  }
  console.log(`\n  Counsellors: ${cOk} created, ${cSkip} skipped, ${cErr} errors\n`);

  // ── 3. Register 500 students ──────────────────────────────────────────────
  console.log(`🎓  Registering ${STUDENTS.length} students…`);
  let sOk = 0, sSkip = 0, sErr = 0;
  for (let i = 0; i < STUDENTS.length; i++) {
    const s   = STUDENTS[i];
    const res = await post(`${BASE}/register/`, {
      full_name:     s.full_name,
      email:         s.email,
      password:      '123456789',
      role:          'student',
      matric_number: s.matric_number,
      department:    s.department,
      level:         s.level,
    });

    if (res.ok) {
      sOk++;
      if ((i + 1) % 50 === 0 || i === STUDENTS.length - 1) {
        process.stdout.write(`  ✓ ${i+1}/${STUDENTS.length} students created…\n`);
      }
    } else if (res.status === 400) {
      sSkip++;
    } else {
      sErr++;
      if (sErr <= 5) process.stdout.write(`  ✗ ${s.full_name} — ${JSON.stringify(res.data)}\n`);
    }
    await sleep(80);
  }
  console.log(`\n  Students: ${sOk} created, ${sSkip} skipped, ${sErr} errors`);

  // ── 4. Summary ────────────────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(50));
  console.log('🎉  SEEDING COMPLETE');
  console.log(`    Counsellors : ${cOk} created  (${cSkip} skipped, ${cErr} errors)`);
  console.log(`    Students    : ${sOk} created  (${sSkip} skipped, ${sErr} errors)`);
  console.log('\n    Refresh the admin dashboard to see the new numbers.');
  console.log('─'.repeat(50) + '\n');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
