# Levantamento Completo de Problemas – PoliMap React

*Documento gerado a partir da análise do código e comparação com o projeto Godot.*

---

## 1. Câmera

### 1.1 Rotação com mouse inexistente
- **Problema:** `camRot` no `CharacterController` é definido com `useRef(0)` mas **nunca é atualizado** por input do mouse.
- **Efeito:** O jogador não consegue rotacionar a câmera com o mouse; a câmera fica fixa em um ângulo.
- **Referência Godot:** `player_3d.gd` usa `_input()` para `InputEventMouseMotion` e atualiza `_camera_pivot.rotation.x/y` com `mouse_sensitivity`.
- **Arquivo:** `src/pages/game/elements/character/CharacterController.tsx` (linhas 37, 106, 145, 175)

### 1.2 Flickering / snap da câmera
- **Problema:** `camera.position.lerp(desiredCamPos, 1)` usa fator **1**, o que faz a câmera “pular” em vez de suavizar.
- **Efeito:** Sensação de flickering ou teleporte da câmera.
- **Sugestão:** Usar `lerp(desiredCamPos, 0.1)` ou similar para interpolação suave.
- **Arquivo:** `CharacterController.tsx` linha 180

### 1.3 Controle de câmera em desktop
- **Problema:** Não há `OrbitControls`, `PointerLockControls` ou qualquer listener de mouse para desktop.
- **Referência Godot:** Câmera orbit controlada por mouse (exceto em mobile).
- **Arquivo:** `game.tsx` – Canvas não possui controles de câmera.

---

## 2. Movimentação do personagem

### 2.1 Movimento travado / inconsistente
- **Problema 1:** Movimento depende de `camRot.current`, que está sempre em 0. A direção de movimento é calculada com `applyAxisAngle(..., -camRot.current)`, então nunca reflete a direção da câmera.
- **Problema 2:** `vel.z = moveVec.z * -1` inverte o eixo Z; pode estar invertido em relação ao esperado.
- **Arquivo:** `CharacterController.tsx` linhas 140, 144–145

### 2.2 Coordenadas do joystick virtual
- **Problema:** `joystickInput.z = -dy` – convenção pode estar invertida em relação ao teclado.
- **Arquivo:** `VirtualJoystick.tsx` linha 34

### 2.3 Colisão / física
- **Problema:** O mapa usa `colliders="trimesh"` no `RigidBody` do modelo inteiro. Trimesh de cena complexa pode gerar:
  - Colisões imprecisas
  - Performance ruim
  - Personagem “grudando” ou atravessando paredes
- **Arquivo:** `src/components/map/Map.tsx` linha 39

---

## 3. Animação do personagem

### 3.1 Nomes das animações do Rogue
- **Problema:** O modelo KayKit Rogue usa animações como `Idle`, `Walking_A`, `Running_B`. O código procura por `Walking` e `Idle` exatos.
- **Efeito:** `Walking_A` não é encontrado por `actions['Walking']`, então a animação de caminhada pode não tocar.
- **Referência Godot:** `rogue.tscn` usa `Idle`, `Walking_A`, `Running_B`.
- **Arquivo:** `Character.tsx` – `WALK_ALTS` e `IDLE_ALTS` precisam incluir `Walking_A`, `Walking_B`, etc.

### 3.2 `groupRef` e `useAnimations`
- **Problema:** `useAnimations(animations, groupRef)` recebe `groupRef`, mas o `primitive object={scene}` está dentro do `group`. O `groupRef` pode não ser o nó correto para aplicar animações no skeleton.
- **Arquivo:** `Character.tsx` linhas 25, 59–61

---

## 4. Navegação

### 4.1 Pathfinding não utilizado
- **Problema:** Existe `pathfinding.ts` com `findPath`, `setNavmesh`, `hasNavmesh`, mas **nenhum deles é usado**.
- **Efeito:** O autopilot vai em linha reta até o destino, atravessando paredes.
- **Referência Godot:** Usa `NavigationAgent3D` e `agent.get_next_path_position()` para seguir o navmesh.
- **Arquivos:** `src/lib/pathfinding.ts` (implementado) vs `CharacterController.tsx` (não chama pathfinding).

### 4.2 Navmesh nunca configurado
- **Problema:** `setNavmesh(geometry)` nunca é chamado. O pathfinding não tem dados de navegação.
- **Arquivo:** `pathfinding.ts` – função existe mas não é usada.

### 4.3 Teleporte vs navegação
- **Problema:** Ao trocar de cena (`model_path` diferente), o fluxo usa `setTeleportPosition` e `setCurrentScene`. O `Physics` remonta com `key={currentScene}`. Pode haver race condition entre:
  - Remontagem do `RigidBody`
  - Execução do `useEffect` que aplica `setTranslation`
- **Arquivo:** `Experience.tsx` linha 75, `CharacterController.tsx` linhas 41–47

---

## 5. Pontos de interesse e posicionamento

### 5.1 `interest_point` zerado
- **Problema:** Em `map_points.json`, todos os `interest_point` estão como `{ "x": 0, "y": 0, "z": 0 }`.
- **Efeito:** Teleporte e navegação levam o jogador sempre para a origem do modelo, não para os POIs reais.
- **Referência Godot:** POIs e portais têm posições definidas nos `.tscn` (ex.: Poli.tscn com transforms em coordenadas como 48, -29, etc.).

### 5.2 Falta de mapeamento Godot → React
- **Problema:** Não há script ou processo para extrair posições de POIs/portais dos `.tscn` do Godot e popular `map_points.json`.
- **Sugestão:** Criar ferramenta ou mapeamento manual das posições do Godot para o React.

### 5.3 Configuração de scale/position por modelo
- **Problema:** `model_bloco_b` e `model_bloco_c` usam `scale: 1` e `position: [0,0,0]`. Os modelos do Godot podem ter escalas e origens diferentes.
- **Arquivo:** `maps.json`

---

## 6. Mapa / modelo 3D

### 6.1 Animação no mapa
- **Problema:** O componente `Map` chama `actions[animations[0].name]?.play()`. Mapas estáticos não precisam de animação; isso pode causar efeitos indesejados se o GLB tiver animações.
- **Arquivo:** `Map.tsx` linhas 32–36

### 6.2 Colisor trimesh
- **Problema:** Já citado em 2.3 – `colliders="trimesh"` no mapa inteiro pode causar problemas de física e performance.

### 6.3 Verificação visual do mapa
- **Problema:** Com câmera fixa, posições erradas e possível clipping, fica difícil avaliar se o mapa está correto.
- **Sugestão:** Adicionar modo debug ou `OrbitControls` temporário para inspeção.

---

## 7. Outros

### 7.1 `KeyboardControls` e `useKeyboardControls`
- **Verificação:** O `KeyboardControls` do drei está configurado e o `CharacterController` usa `useKeyboardControls`. O mapeamento parece correto.

### 7.2 VirtualJoystick só em touch
- **Problema:** `VirtualJoystick` só é renderizado quando `isTouchDevice` é true. Em desktop, não há joystick virtual.
- **Arquivo:** `VirtualJoystick.tsx` linha 78

### 7.3 Deprecation do Rapier
- **Problema:** Aviso “pass a single object instead” vem de `@dimforge/rapier3d-compat`. Depende de atualização do pacote.

---

## Resumo de prioridades

| Prioridade | Item                          | Impacto                          |
|-----------|-------------------------------|----------------------------------|
| Alta      | Rotação da câmera com mouse   | Jogabilidade em desktop          |
| Alta      | `interest_point` zerados      | Navegação e teleporte inúteis    |
| Alta      | Animação do personagem        | Personagem parado visualmente    |
| Média     | Pathfinding no autopilot       | Atravessar paredes               |
| Média     | Suavização da câmera          | Flickering                       |
| Média     | Colisor trimesh do mapa       | Física e performance             |
| Baixa     | Animação no Map               | Possível efeito colateral         |
| Baixa     | Inversão de eixos (Z)         | Direção do movimento             |

---

## Referências do projeto Godot

- **Player:** `scripts/player/player_3d.gd`
- **Câmera:** `_camera_pivot`, `_camera`, `mouse_sensitivity`, `camera_rotation()`
- **Navegação:** `NavigationAgent3D`, `agent.get_next_path_position()`
- **Personagem:** `scenes/Character/rogue.tscn`, animações `Idle`, `Walking_A`, `Running_B`
- **Mapas:** `data/maps/Poli.tscn`, `PoliBlocoB.tscn`, etc.
- **POIs:** `data/pois/*.tres`, posições nos `.tscn`
