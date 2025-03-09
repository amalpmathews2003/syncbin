import { pack } from 'msgpackr';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { useWebSocketStore } from '../ws-store';
import { useEditorStore } from './editor-store';

export function EditToggler() {
  const isEditable = useEditorStore(state => state.isEditable);
  const setIsEditable = useEditorStore(state => state.setIsEditable);

  const ownerId = useWebSocketStore(state => state.ownerId);
  const ws = useWebSocketStore(state => state.ws);
  const socketId = ws?.id;

  const isOwner = ownerId == socketId ? true : false;

  function onCheckedChange(checked: boolean) {
    setIsEditable(checked);
    ws?.send(
      pack({
        isEditable: checked,
      }),
    );
  }

  if (isOwner === true)
    return (
      <div className="flex items-center space-x-2">
        <Switch
          id="Allow editing"
          checked={isEditable}
          onCheckedChange={onCheckedChange}
        />
        <Label htmlFor="Allow editing">Allow editing</Label>
      </div>
    );
}
