import os,glob,struct,sys,re,shutil
home=os.path.expanduser('~/mnt')
dl=home+'/Downloads'; out=home+'/Desktop/_photo_work'
marker=os.path.getmtime(out+'/.start_marker')
n=0
for f in [dl+'/'+x for x in os.listdir(dl) if os.path.isfile(dl+'/'+x)]:
    if os.path.getmtime(f)<=marker or os.path.getsize(f)==0: continue
    b=open(f,'rb').read()
    if b[:4]!=b'\xff\xd8\xff\xfe': continue
    L=struct.unpack('>H',b[4:6])[0]
    com=b[6:4+L].decode('utf8','replace')
    if not com.startswith('PP|'): continue
    _,school,player=com.split('|',2)
    safe=lambda s:re.sub(r'[\\/:*?"<>|]','',s).strip()
    d=out+'/'+safe(school); os.makedirs(d,exist_ok=True)
    open(d+'/'+safe(player)+'.jpg','wb').write(b[:2]+b[4+L:])
    shutil.move(f, dl+'/_pp_staging/'+os.path.basename(f).lstrip('.')+'.'+str(int(os.path.getmtime(f)*1000))+'.jpg')
    n+=1
print('collected',n)
